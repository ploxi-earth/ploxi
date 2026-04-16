import { ALLOWED_VENDOR_LOGO_MIME, VENDOR_LOGO_MAX_BYTES } from '@/lib/vendorLogoConstants';

export type VendorLogoValidation = { ok: true; ext: string } | { ok: false; message: string };

export function validateVendorLogoFile(file: File): VendorLogoValidation {
  if (!file || !file.size) return { ok: false, message: 'Please choose an image file.' };
  if (file.size > VENDOR_LOGO_MAX_BYTES) {
    return { ok: false, message: 'Image must be 2 MB or smaller.' };
  }
  const ext = ALLOWED_VENDOR_LOGO_MIME[file.type];
  if (!ext) {
    return { ok: false, message: 'Only PNG, JPEG, WebP, or GIF images are allowed.' };
  }
  return { ok: true, ext };
}
