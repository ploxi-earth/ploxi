import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, otp } = await request.json();

    console.log('🔍 Corporate Verify OTP Request:', email);

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

    // Update registration record - mark Step 1 complete
    const { error: updateError } = await supabase
      .from('corporate_registrations')
      .update({
        email_verified: true,
        status: 'step1_completed',
        registration_step: 1,
      })
      .eq('email', email);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      throw updateError;
    }

    console.log('✅ Step 1 completed, ready for onboarding');

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
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
