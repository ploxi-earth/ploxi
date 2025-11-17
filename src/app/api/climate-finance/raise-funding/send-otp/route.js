import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, formData } = body;

    console.log('📧 Send OTP Request:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Check if email already registered and verified
    const { data: existing } = await supabase
      .from('raise_funding_registrations')
      .select('email, email_verified')
      .eq('email', email)
      .single();

    if (existing?.email_verified) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }

    // Prepare data to save
    const dataToSave = {
      company_name: formData.companyName,
      email: email,
      funding_stage: formData.fundingStage,
      funding_amount: formData.fundingAmount,
      funding_purpose: formData.fundingPurpose,
      current_revenue: formData.currentRevenue || null,
      use_of_funds: formData.useOfFunds,
      email_verified: false,
      status: 'pending',
      user_type: 'raise_funding',
    };

    // Insert or update registration data
    if (existing) {
      await supabase
        .from('raise_funding_registrations')
        .update(dataToSave)
        .eq('email', email);
    } else {
      await supabase
        .from('raise_funding_registrations')
        .insert(dataToSave);
    }

    // Send OTP via Supabase Auth (this will send the actual OTP email)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
    //   options: {
    //     shouldCreateUser: false,
    //   },
    });

    if (otpError) {
      console.error('❌ OTP send error:', otpError);
      throw otpError;
    }

    console.log('✅ OTP sent successfully to:', email);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
    });

  } catch (error) {
    console.error('❌ Send OTP Error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
