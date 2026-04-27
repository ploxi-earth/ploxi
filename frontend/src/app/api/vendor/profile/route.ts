import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import {
  calculateVendorProfileCompletionFromRows,
  isValidGstNumber,
  isVendorProfileOnboardingReadyFromRows,
  normalizeGstNumber,
  normalizeStringArray,
} from '@/lib/vendorProfile';

function toStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function buildVendorProfilePayload(vendor: any, profile: any) {
  return {
    companyName: vendor?.company_name ?? null,
    contactPerson: vendor?.contact_person ?? null,
    email: vendor?.email ?? null,
    phone: vendor?.phone ?? null,
    vendorType: vendor?.vendor_type ?? 'service',
    website: profile?.website ?? null,
    companyDescription: profile?.description ?? null,
    servicesOffered: profile?.services ?? null,
    sector: profile?.sector ?? null,
    location: profile?.location ?? null,
    locationsServed: normalizeStringArray(profile?.locations_served),
    industryFocus: normalizeStringArray(profile?.industry_focus),
    corporateProfile: profile?.corporate_profile ?? null,
    corporateProfileFileUrl: profile?.corporate_profile_file_url ?? null,
    legalEntityName: profile?.legal_entity_name ?? null,
    gstNumber: profile?.gst_number ?? null,
    registeredAddress: profile?.registered_address ?? null,
    profileCompleted: Boolean(profile?.profile_completed),
    profileCompletion: calculateVendorProfileCompletionFromRows(vendor, profile),
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
    const gstNumber = body.gstNumber !== undefined ? normalizeGstNumber(body.gstNumber) : undefined;

    if (gstNumber !== undefined && gstNumber && !isValidGstNumber(gstNumber)) {
      return jsonError('GST number format is invalid.', 400);
    }

    // Update vendor fields
    const vendorUpdates: Record<string, unknown> = {};
    if (body.companyName !== undefined) vendorUpdates.company_name = toStr(body.companyName).trim();
    if (body.contactPerson !== undefined) vendorUpdates.contact_person = toStr(body.contactPerson).trim();
    if (body.phone !== undefined) vendorUpdates.phone = toStr(body.phone).trim();
    if (Object.keys(vendorUpdates).length > 0) {
      await supabase.from('vendors').update(vendorUpdates).eq('id', vendorId);
    }

    const locationsServed =
      body.locationsServed !== undefined
        ? normalizeStringArray(body.locationsServed)
        : undefined;
    const industryFocus =
      body.industryFocus !== undefined
        ? normalizeStringArray(body.industryFocus)
        : undefined;

    // Update profile
    const profileFields: Record<string, unknown> = {};
    if (body.servicesOffered !== undefined) profileFields.services = toStr(body.servicesOffered).trim();
    if (body.sector !== undefined) profileFields.sector = toStr(body.sector).trim();
    if (body.location !== undefined) profileFields.location = toStr(body.location).trim();
    if (body.website !== undefined) profileFields.website = toStr(body.website).trim();
    if (body.companyDescription !== undefined) profileFields.description = toStr(body.companyDescription).trim();
    if (locationsServed !== undefined) profileFields.locations_served = locationsServed;
    if (industryFocus !== undefined) profileFields.industry_focus = industryFocus;
    if (body.corporateProfile !== undefined)
      profileFields.corporate_profile = toStr(body.corporateProfile).trim();
    if (body.legalEntityName !== undefined)
      profileFields.legal_entity_name = toStr(body.legalEntityName).trim();
    if (gstNumber !== undefined) profileFields.gst_number = gstNumber;
    if (body.registeredAddress !== undefined)
      profileFields.registered_address = toStr(body.registeredAddress).trim();

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

    const onboardingReady = isVendorProfileOnboardingReadyFromRows(updatedVendor, updatedProfile);

    await supabase
      .from('vendor_profiles')
      .update({
        profile_completed: onboardingReady,
        updated_at: new Date().toISOString(),
      })
      .eq('vendor_id', vendorId);

    if (onboardingReady) {
      const now = new Date().toISOString();

      await supabase
        .from('onboarding_stages')
        .update({ status: 'completed', completed_at: now })
        .eq('vendor_id', vendorId)
        .eq('stage_name', 'company_details_submitted');

      await supabase
        .from('onboarding_stages')
        .update({ status: 'active' })
        .eq('vendor_id', vendorId)
        .eq('stage_name', 'intro_meeting_scheduled')
        .neq('status', 'completed');
    }

    const { data: finalProfile } = await supabase
      .from('vendor_profiles')
      .select('*')
      .eq('vendor_id', vendorId)
      .maybeSingle();

    return jsonOk({ success: true, data: buildVendorProfilePayload(updatedVendor, finalProfile) });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
