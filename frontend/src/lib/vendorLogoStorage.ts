import { supabase } from '@/lib/supabase';
import { VENDOR_LOGO_BUCKET } from '@/lib/vendorLogoConstants';

/**
 * Upload to vendor-logos/{vendorId}/logo.<ext>, replace any previous logo.* in that folder.
 * Returns the public URL from Supabase Storage.
 */
export async function uploadVendorLogoToStorage(
  vendorId: string,
  body: ArrayBuffer,
  mimeType: string,
  ext: string
): Promise<string> {
  const path = `${vendorId}/logo.${ext}`;
  const bytes = new Uint8Array(body);

  const { data: listed, error: listErr } = await supabase.storage.from(VENDOR_LOGO_BUCKET).list(vendorId);
  if (listErr) throw listErr;

  const stale = (listed || []).filter((f) => f.name.startsWith('logo.')).map((f) => `${vendorId}/${f.name}`);
  if (stale.length > 0) {
    const { error: rmErr } = await supabase.storage.from(VENDOR_LOGO_BUCKET).remove(stale);
    if (rmErr) throw rmErr;
  }

  const { error: upErr } = await supabase.storage.from(VENDOR_LOGO_BUCKET).upload(path, bytes, {
    contentType: mimeType,
    upsert: true,
  });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(VENDOR_LOGO_BUCKET).getPublicUrl(path);
  const base = pub.publicUrl;
  // Bust browser/CDN cache when the same object path is overwritten.
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}t=${Date.now()}`;
}
