import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Try to query the corporate table
    const { data, error } = await supabase
      .from('corporate_registrations')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connected!',
      tables: ['corporate_registrations', 'vendor_registrations', 'climate_finance_registrations']
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
