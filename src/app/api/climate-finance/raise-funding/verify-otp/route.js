import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, otp } = await request.json();

    console.log('🔍 Verify OTP Request:', email, 'OTP:', otp);

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (authError || !authData.session) {
      console.error('❌ OTP verification failed:', authError);
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    console.log('✅ OTP verified successfully');

    // Update registration record
    const { error: updateError } = await supabase
      .from('raise_funding_registrations')
      .update({
        email_verified: true,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      throw updateError;
    }

    console.log('✅ Registration completed');

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
      session: authData.session,
    });

  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
