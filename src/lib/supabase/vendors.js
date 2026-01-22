import { createClient } from '@/lib/supabase/server';

// Get all vendors
export async function getAllVendors() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get vendor by ID with related data
export async function getVendorById(id) {
  const supabase = await createClient();

  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (vendorError) throw vendorError;

  // Get past projects
  const { data: pastProjects } = await supabase
    .from('vendor_past_projects')
    .select('*')
    .eq('vendor_id', id)
    .order('display_order');

  // Get live projects
  const { data: liveProjects } = await supabase
    .from('vendor_live_projects')
    .select('*')
    .eq('vendor_id', id)
    .order('display_order');

  // Get documents
  const { data: documents } = await supabase
    .from('vendor_documents')
    .select('*')
    .eq('vendor_id', id);

  return {
    ...vendor,
    pastProjects: pastProjects || [],
    liveProjects: liveProjects || [],
    documents: documents || [],
  };
}

// Create vendor
export async function createVendor(vendorData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendors')
    .insert(vendorData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update vendor
export async function updateVendor(id, vendorData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendors')
    .update(vendorData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete vendor
export async function deleteVendor(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Upload file to Supabase Storage
export async function uploadFile(file, path) {
  const supabase = await createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('vendors')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('vendors')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Get vendor milestones
export async function getVendorMilestones(vendorId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendor_milestones')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get vendor clients
export async function getVendorClients(vendorId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendor_clients')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Create milestone
export async function createMilestone(milestoneData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendor_milestones')
    .insert(milestoneData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete milestone
export async function deleteMilestone(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('vendor_milestones')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Create vendor client
export async function createVendorClient(clientData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendor_clients')
    .insert(clientData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete vendor client
export async function deleteVendorClient(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('vendor_clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
