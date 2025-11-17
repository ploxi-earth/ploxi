import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Test connection
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ 
    success: true, 
    message: 'Supabase connection working!',
    session: data.session ? 'Active session' : 'No active session'
  })
}
