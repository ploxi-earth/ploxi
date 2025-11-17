import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, formData } = await request.json();

    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existing, error: selectError } = await supabase
      .from('climate_finance_registrations')
      .select('email_verified')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error("Select error:", selectError);
    }

    if (existing?.email_verified) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    console.log("Sending OTP to:", email);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }, // ✅ allow OTP for new users
    });

    if (otpError) throw otpError;

    // Build insert/update payload
    const climateData = {
      email,
      user_type: formData.userType,
      first_name: formData.firstName,
      last_name: formData.lastName,
      organization_name: formData.organizationName,
      ...(formData.userType === 'investor' && {
        fund_size: formData.fundSize,
        investment_stage: formData.investmentStage,
        sectors_of_interest: formData.sectors,
      }),
    };

    console.log("Inserting/Updating:", climateData);

    const { error: dbError } = existing
      ? await supabase.from('climate_finance_registrations').update(climateData).eq('email', email)
      : await supabase.from('climate_finance_registrations').insert(climateData);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
