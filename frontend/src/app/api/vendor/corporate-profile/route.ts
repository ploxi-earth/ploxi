import { NextRequest } from 'next/server';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): { ok: boolean; message: string } {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { ok: false, message: 'Invalid file type. Allowed: PDF, DOC, DOCX' };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.some(e => file.name.toLowerCase().endsWith(e))) {
    return { ok: false, message: 'Invalid file type. Allowed: PDF, DOC, DOCX' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, message: 'File size must be less than 10MB.' };
  }
  return { ok: true, message: '' };
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return jsonError('Missing file. Use form field "file".', 400);
    }

    const validation = validateFile(file);
    if (!validation.ok) return jsonError(validation.message, 400);

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileName = `corporate-profile${ext}`;
    const filePath = `${vendorId}/${fileName}`;

    // Upload to Supabase Storage
    const bucketName = 'vendor-documents';
    const buffer = await file.arrayBuffer();

    // First, try to delete existing file if any
    const { data: existingFiles } = await supabase.storage
      .from(bucketName)
      .list(`${vendorId}/`, { search: 'corporate-profile' });

    if (existingFiles && existingFiles.length > 0) {
      for (const existingFile of existingFiles) {
        await supabase.storage
          .from(bucketName)
          .remove([`${vendorId}/${existingFile.name}`]);
      }
    }

    // Upload new file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Corporate profile upload error:', uploadError);
      return jsonError('Failed to upload file. Please try again.', 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    // Update vendor profile with file URL
    const { error: profileError } = await supabase
      .from('vendor_profiles')
      .upsert({
        vendor_id: vendorId,
        corporate_profile_file_url: publicUrl,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'vendor_id',
      });

    if (profileError) {
      console.error('Vendor profile update error:', profileError);
      return jsonError('File uploaded but failed to save profile. Please try again.', 500);
    }

    return jsonOk({ success: true, data: { fileUrl: publicUrl } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    console.error('POST /api/vendor/corporate-profile', err);
    return jsonError('Upload failed. Check storage configuration or try again.', 500);
  }
}