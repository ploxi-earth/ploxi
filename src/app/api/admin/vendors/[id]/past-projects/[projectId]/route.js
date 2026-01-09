import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// DELETE past project
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { projectId } = params;
    
    const { error } = await supabase
      .from('vendor_past_projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting past project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// PATCH update past project
export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient();
    const { projectId } = params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('vendor_past_projects')
      .update(body)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating past project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
