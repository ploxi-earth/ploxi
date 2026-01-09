import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// DELETE live project
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { projectId } = params;
    
    const { error } = await supabase
      .from('vendor_live_projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting live project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// PATCH update live project
export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient();
    const { projectId } = params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('vendor_live_projects')
      .update(body)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating live project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
