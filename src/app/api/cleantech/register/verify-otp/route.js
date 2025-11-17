import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, otp } = await request.json();

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error || !data.session) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    await supabase
      .from('vendor_registrations')
      .update({
        email_verified: true,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('email', email);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
