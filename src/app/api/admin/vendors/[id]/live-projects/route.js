import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET all live projects for a vendor
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('vendor_live_projects')
      .select('*')
      .eq('vendor_id', id)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching live projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new live project
export async function POST(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('vendor_live_projects')
      .insert({
        ...body,
        vendor_id: id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating live project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
