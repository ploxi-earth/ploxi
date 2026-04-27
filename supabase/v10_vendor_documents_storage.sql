-- Supabase Storage: vendor-documents bucket
-- Run this in Supabase SQL Editor to create the storage bucket and policies

-- Create the vendor-documents bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-documents',
  'vendor-documents',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for vendor-documents bucket

-- Policy 1: Vendors can upload their own corporate profile files
CREATE POLICY "Vendors can upload corporate profile files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendor-documents' 
  AND (storage.foldername(name))[1] = (auth.jwt()->>'vendor_id')
);

-- Policy 2: Vendors can view their own corporate profile files
CREATE POLICY "Vendors can view their own corporate profile files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'vendor-documents' 
  AND (storage.foldername(name))[1] = (auth.jwt()->>'vendor_id')
);

-- Policy 3: Vendors can update their own corporate profile files
CREATE POLICY "Vendors can update their own corporate profile files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vendor-documents' 
  AND (storage.foldername(name))[1] = (auth.jwt()->>'vendor_id')
);

-- Policy 4: Vendors can delete their own corporate profile files
CREATE POLICY "Vendors can delete their own corporate profile files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendor-documents' 
  AND (storage.foldername(name))[1] = (auth.jwt()->>'vendor_id')
);

-- Policy 5: Platform admins can view all vendor documents
CREATE POLICY "Platform admins can view all vendor documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'vendor-documents'
  AND exists (
    select 1 from public.vendors v
    join auth.users u on v.email = u.email
    where u.id = auth.uid()
    and (u.raw_user_meta_data->>'role') = 'platform_admin'
  )
);

-- Add corporate_profile_file_url column to vendor_profiles table if not exists
ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS corporate_profile_file_url TEXT;

-- Comment for documentation
COMMENT ON COLUMN vendor_profiles.corporate_profile_file_url IS 'URL to uploaded corporate profile document (PDF, DOC, DOCX)';