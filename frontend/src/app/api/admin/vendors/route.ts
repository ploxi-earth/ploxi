import { NextRequest } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

const ONBOARDING_STAGES = [
  'registration', 'admin_review', 'company_details_submitted',
  'intro_meeting_scheduled', 'agreement_sent', 'agreement_signed', 'onboarded',
];

// GET /api/admin/vendors — list all vendors
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, 'platform_admin');

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    let query = supabase.from('vendors').select('*', { count: 'exact' });
    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: vendors, count: total } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return jsonOk({
      success: true,
      data: vendors || [],
      pagination: { total: total || 0, page, limit, pages: Math.ceil((total || 0) / limit) },
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}

// POST /api/admin/vendors — admin creates vendor
export async function POST(req: NextRequest) {
  try {
    await requireRole(req, 'platform_admin');
    const { companyName, email, phone, contactPerson } = await req.json();

    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existing) return jsonError('A vendor with this email already exists.', 400);

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const password_hash = await bcrypt.hash(tempPassword, 12);

    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert({
        company_name: companyName,
        contact_person: contactPerson,
        email: email.toLowerCase().trim(),
        phone,
        password_hash,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) throw error;

    // Seed onboarding stages
    const stages = ONBOARDING_STAGES.map((stage_name, idx) => ({
      vendor_id: vendor.id,
      stage_name,
      status: idx === 0 ? 'completed' : idx === 1 ? 'active' : 'pending',
      completed_at: idx === 0 ? new Date().toISOString() : null,
    }));
    await supabase.from('onboarding_stages').insert(stages);

    return jsonOk({ success: true, data: vendor, message: 'Vendor added.' }, 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
