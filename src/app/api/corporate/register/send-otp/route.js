import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, formData } = body;

    console.log('📧 Corporate Send OTP Request:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Check if email already registered and verified
    const { data: existing } = await supabase
      .from('corporate_registrations')
      .select('email, email_verified')
      .eq('email', email)
      .single();

    if (existing?.email_verified) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }

    // Prepare Step 1 data
    const dataToSave = {
      full_name: formData.fullName,
      designation: formData.designation,
      company_name: formData.companyName,
      website: formData.website || null,
      industry_sector: formData.industrySector === 'Other' 
        ? formData.customIndustry 
        : formData.industrySector,
      custom_industry: formData.industrySector === 'Other' ? formData.customIndustry : null,
      email: email,
      phone: `${formData.countryCode}${formData.phone}`,
      email_verified: false,
      registration_step: 1,
      status: 'pending',
    };

    // Insert or update
    if (existing) {
      await supabase
        .from('corporate_registrations')
        .update(dataToSave)
        .eq('email', email);
    } else {
      await supabase
        .from('corporate_registrations')
        .insert(dataToSave);
    }

    // Send OTP via Supabase Auth
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      // options: {
      //   shouldCreateUser: false,
      // },
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
