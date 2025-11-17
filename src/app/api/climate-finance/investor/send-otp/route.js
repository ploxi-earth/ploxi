import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, formData } = body;

    console.log('📧 Investor Send OTP Request:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Check if email already registered and verified
    const { data: existing } = await supabase
      .from('investor_registrations')
      .select('email, email_verified')
      .eq('email', email)
      .single();

    if (existing?.email_verified) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }

    // Prepare comprehensive investor data
    const dataToSave = {
      // Personal
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: email,
      phone: formData.phone || null,
      linkedin_url: formData.linkedin_url || null,
      designation: formData.designation || null,
      
      // Organization
      organization_name: formData.organization_name,
      fund_name: formData.fund_name || null,
      organization_type: formData.organization_type,
      fund_size: formData.fund_size || null,
      fund_size_range: formData.fund_size_range || null,
      aum: formData.aum || null,
      fund_vintage: formData.fund_vintage || null,
      website: formData.website || null,
      
      // Investment Focus
      sectors_of_interest: formData.sectors_of_interest || [],
      investment_stages: formData.investment_stages || [],
      geographic_focus: formData.geographic_focus || [],
      typical_ticket_size: formData.typical_ticket_size || null,
      min_investment: formData.min_investment || null,
      max_investment: formData.max_investment || null,
      
      // Financing
      financing_types: formData.financing_types || [],
      investment_structures: formData.investment_structures || [],
      
      // ESG
      esg_focus: formData.esg_focus || [],
      impact_metrics: formData.impact_metrics || [],
      certifications: formData.certifications || [],
      sdg_alignment: formData.sdg_alignment || [],
      
      // Additional
      investment_criteria: formData.investment_criteria || null,
      portfolio_companies: formData.portfolio_companies || null,
      recent_investments: formData.recent_investments || null,
      value_add: formData.value_add || null,
      decision_timeline: formData.decision_timeline || null,
      due_diligence_process: formData.due_diligence_process || null,
      
      // Metadata
      email_verified: false,
      status: 'pending',
      user_type: 'investor',
    };

    // Insert or update
    if (existing) {
      await supabase
        .from('investor_registrations')
        .update(dataToSave)
        .eq('email', email);
    } else {
      await supabase
        .from('investor_registrations')
        .insert(dataToSave);
    }

    // Send OTP via Supabase Auth
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
