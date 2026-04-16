import { NextRequest } from 'next/server';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import { validateVendorLogoFile } from '@/lib/vendorLogoValidation';
import { uploadVendorLogoToStorage } from '@/lib/vendorLogoStorage';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const formData = await req.formData();
    const file = formData.get('logo');
    if (!file || typeof file === 'string') {
      return jsonError('Missing logo file. Use form field "logo".', 400);
    }

    const validation = validateVendorLogoFile(file);
    if (!validation.ok) return jsonError(validation.message, 400);

    const buffer = await file.arrayBuffer();
    const publicUrl = await uploadVendorLogoToStorage(vendorId, buffer, file.type, validation.ext);

    const { error: dbErr } = await supabase.from('vendors').update({ logo_url: publicUrl }).eq('id', vendorId);
    if (dbErr) {
      console.error('vendor logo_url update', dbErr);
      return jsonError('Logo uploaded but failed to save profile. Please try again.', 500);
    }

    return jsonOk({ success: true, data: { logoUrl: publicUrl } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    console.error('POST /api/vendor/logo', err);
    return jsonError('Upload failed. Check storage configuration or try again.', 500);
  }
}
