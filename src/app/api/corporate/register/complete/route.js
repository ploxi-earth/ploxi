import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, onboardingData } = await request.json();

    console.log('📝 Complete Registration Request:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if registration exists and email is verified
    const { data: existing } = await supabase
      .from('corporate_registrations')
      .select('email_verified, status')
      .eq('email', email)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (!existing.email_verified) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 400 }
      );
    }

    // Update with Step 2 onboarding data
    const { error: updateError } = await supabase
      .from('corporate_registrations')
      .update({
        geography: onboardingData.geography,
        esg_frameworks: onboardingData.esgFrameworks,
        sustainability_stage: onboardingData.sustainabilityStage,
        esg_saas_integration: onboardingData.esgSaasIntegration,
        status: 'completed',
        registration_step: 2,
        completed_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      console.error('❌ Complete registration error:', updateError);
      throw updateError;
    }

    console.log('✅ Corporate registration completed');

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
    });

  } catch (error) {
    console.error('❌ Complete Registration Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete registration' },
      { status: 500 }
    );
  }
}
