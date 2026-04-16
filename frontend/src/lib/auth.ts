import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { supabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET!;

// ── Types ─────────────────────────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'platform_admin' | 'vendor' | 'consultant' | 'manager';
  vendorId?: string;
}

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// ── Sign JWT (now includes role) ──────────────────────────────────────────
export function signToken(userId: string, role: string, expiresIn: string = '1d'): string {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function signRefreshToken(userId: string, role: string): string {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' as any });
}

// ── Verify JWT & return user ──────────────────────────────────────────────
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }

  const role = decoded.role;

  // ── Admin / Consultant / Manager → admin_users table ────────────────
  if (role === 'platform_admin' || role === 'consultant' || role === 'manager') {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id, name, email, is_active, password_changed_at')
      .eq('id', decoded.id)
      .single();

    if (!admin) return null;

    if (admin.password_changed_at) {
      const changedTs = Math.floor(new Date(admin.password_changed_at).getTime() / 1000);
      if (decoded.iat < changedTs) return null;
    }
    if (admin.is_active === false) return null;

    return {
      _id: admin.id,
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: role as AuthUser['role'],
    };
  }

  // ── Vendor → vendors table ──────────────────────────────────────────
  if (role === 'vendor') {
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, company_name, contact_person, email, status, email_verified')
      .eq('id', decoded.id)
      .single();

    if (!vendor) return null;
    if (vendor.status === 'rejected') return null;
    if (vendor.email_verified === false) return null;

    return {
      _id: vendor.id,
      id: vendor.id,
      name: vendor.contact_person,
      email: vendor.email,
      role: 'vendor',
      vendorId: vendor.id,
    };
  }

  return null;
}

// ── Require auth (throws JSON response if unauthorized) ───────────────────
export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(req);
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

// ── Require specific role ─────────────────────────────────────────────────
export async function requireRole(req: NextRequest, ...roles: string[]): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (!roles.includes(user.role)) throw new Error('FORBIDDEN');
  return user;
}

// ── JSON helpers ──────────────────────────────────────────────────────────
export function jsonOk(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return Response.json({ success: false, message }, { status });
}

// ── Send token response (matches Express format for frontend compat) ──────
export function sendTokenResponse(user: { id: string; name: string; email: string; role: string }) {
  const accessToken = signToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  return jsonOk({
    success: true,
    accessToken,
    refreshToken,
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
