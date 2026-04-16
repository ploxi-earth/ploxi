/** Shared rules for vendor logo uploads (client + server). */
export const VENDOR_LOGO_BUCKET = 'vendor-logos';

export const VENDOR_LOGO_MAX_BYTES = 2 * 1024 * 1024;

/** MIME → file extension for storage object name `logo.<ext>`. */
export const ALLOWED_VENDOR_LOGO_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const ALLOWED_VENDOR_LOGO_ACCEPT = Object.keys(ALLOWED_VENDOR_LOGO_MIME).join(',');
