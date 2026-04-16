import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

function toStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function isFilled(v: unknown): boolean {
  return typeof v === 'string' ? v.trim().length > 0 : v !== null && v !== undefined;
}

function buildVendorProfilePayload(vendor: any, profile: any) {
  return {
    companyName: vendor?.company_name ?? null,
    contactPerson: vendor?.contact_person ?? null,
    email: vendor?.email ?? null,
    phone: vendor?.phone ?? null,
    website: profile?.website ?? null,
    companyDescription: profile?.description ?? null,
    servicesOffered: profile?.services ?? null,
    sector: profile?.sector ?? null,
    location: profile?.location ?? null,
    profileCompleted: Boolean(profile?.profile_completed),
    logoUrl: vendor?.logo_url ?? null,
  };
}

// GET /api/vendor/profile
export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const { data: vendor } = await supabase.from('vendors').select('*').eq('id', vendorId).single();
    if (!vendor) return jsonError('Vendor profile not found.', 404);

    const { data: profile } = await supabase
      .from('vendor_profiles')
      .select('*')
      .eq('vendor_id', vendorId)
      .maybeSingle();

    return jsonOk({ success: true, data: buildVendorProfilePayload(vendor, profile) });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}

// PUT /api/vendor/profile
export async function PUT(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const body = await req.json();

    // Update vendor fields
    const vendorUpdates: Record<string, unknown> = {};
    if (body.companyName !== undefined) vendorUpdates.company_name = toStr(body.companyName).trim();
    if (body.contactPerson !== undefined) vendorUpdates.contact_person = toStr(body.contactPerson).trim();
    if (body.phone !== undefined) vendorUpdates.phone = toStr(body.phone).trim();
    if (Object.keys(vendorUpdates).length > 0) {
      await supabase.from('vendors').update(vendorUpdates).eq('id', vendorId);
    }

    // Update profile
    const profileFields: Record<string, unknown> = {};
    if (body.servicesOffered !== undefined) profileFields.services = toStr(body.servicesOffered).trim();
    if (body.sector !== undefined) profileFields.sector = toStr(body.sector).trim();
    if (body.location !== undefined) profileFields.location = toStr(body.location).trim();
    if (body.website !== undefined) profileFields.website = toStr(body.website).trim();
    if (body.companyDescription !== undefined) profileFields.description = toStr(body.companyDescription).trim();

    // Decide profile_completed based on required fields.
    // This keeps vendor dashboard/profile progress consistent.
    const requiredFilled = [
      body.companyName,
      body.contactPerson,
      body.phone,
      body.website,
      body.servicesOffered,
      body.sector,
      body.location,
      body.companyDescription,
    ].every(isFilled);
    profileFields.profile_completed = requiredFilled;

    if (Object.keys(profileFields).length > 0) {
      const { data: existing } = await supabase.from('vendor_profiles').select('id').eq('vendor_id', vendorId).maybeSingle();
      if (existing) {
        await supabase.from('vendor_profiles').update({ ...profileFields, updated_at: new Date().toISOString() }).eq('vendor_id', vendorId);
      } else {
        await supabase.from('vendor_profiles').insert({ vendor_id: vendorId, ...profileFields });
      }
    }

    const { data: updatedVendor } = await supabase.from('vendors').select('*').eq('id', vendorId).single();
    const { data: updatedProfile } = await supabase
      .from('vendor_profiles')
      .select('*')
      .eq('vendor_id', vendorId)
      .maybeSingle();

    return jsonOk({ success: true, data: buildVendorProfilePayload(updatedVendor, updatedProfile) });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
