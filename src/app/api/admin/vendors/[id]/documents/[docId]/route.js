import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// DELETE document
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { docId } = params;
    
    // Get document details first to delete from storage
    const { data: doc } = await supabase
      .from('vendor_documents')
      .select('file_url')
      .eq('id', docId)
      .single();
    
    // Delete from database
    const { error } = await supabase
      .from('vendor_documents')
      .delete()
      .eq('id', docId);
    
    if (error) throw error;
    
    // Optionally delete from storage (extract path from URL)
    // This is optional - you might want to keep files even after DB deletion
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
