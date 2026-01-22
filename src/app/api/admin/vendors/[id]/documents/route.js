import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET all documents for a vendor
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('vendor_documents')
      .select('*')
      .eq('vendor_id', id)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST create a new document
export async function POST(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();

    const documentData = {
      vendor_id: id,
      file_name: body.file_name || body.document_name || 'Untitled Document',
      file_url: body.file_url || body.document_url,
      document_type: body.document_type || body.file_type || 'other',
    };

    const { data, error } = await supabase
      .from('vendor_documents')
      .insert(documentData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
