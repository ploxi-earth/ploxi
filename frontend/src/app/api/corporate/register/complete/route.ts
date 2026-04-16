import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsonOk, jsonError } from '@/lib/auth';

/** Steps 2–3: require verified email, then save ESG + verification fields. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      fullName, designation, companyName, website, industrySector, customIndustry, phone,
      currentEsgFrameworks, esgReportingStatus, primaryEsgGoals,
      complianceRegulations, annualRevenueBand, employeeCount, sustainabilityTeamSize,
      hearAboutUs, additionalNotes,
      geography, esgFrameworks, sustainabilityStage, esgSaasIntegration,
    } = body;

    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';
    if (!em) return jsonError('Email is required.', 400);

    const { data: row } = await supabase
      .from('corporate_registrations')
      .select('id, email_verified')
      .eq('email', em)
      .maybeSingle();

    if (!row) return jsonError('Registration not found. Start from step 1.', 404);
    if (!row.email_verified) return jsonError('Please verify your email before submitting.', 403);

    const industry =
      industrySector === 'Other' && customIndustry ? String(customIndustry).trim() : String(industrySector || '');

    const { error } = await supabase
      .from('corporate_registrations')
      .update({
        full_name: String(fullName || '').trim(),
        designation: String(designation || '').trim(),
        company_name: String(companyName || '').trim(),
        website: website ? String(website).trim() : null,
        industry_sector: industry,
        custom_industry: industrySector === 'Other' ? String(customIndustry || '').trim() || null : null,
        phone: String(phone || '').trim(),
        current_esg_frameworks: currentEsgFrameworks || [],
        esg_reporting_status: esgReportingStatus || null,
        primary_esg_goals: primaryEsgGoals || [],
        compliance_regulations: complianceRegulations || [],
        annual_revenue_band: annualRevenueBand || null,
        employee_count: employeeCount || null,
        sustainability_team_size: sustainabilityTeamSize || null,
        hear_about_us: hearAboutUs || null,
        additional_notes: additionalNotes || null,
        geography: geography || null,
        esg_frameworks: esgFrameworks || null,
        sustainability_stage: sustainabilityStage || null,
        esg_saas_integration: esgSaasIntegration || null,
        registration_step: 3,
        status: 'pending',
        completed_at: new Date().toISOString(),
      })
      .eq('email', em);

    if (error) {
      console.error('corporate complete', error);
      return jsonError('Could not complete registration.', 500);
    }

    return jsonOk({
      success: true,
      message: 'Thank you! Your registration has been received.',
    });
  } catch (e) {
    console.error('corporate complete', e);
    return jsonError('Internal server error.', 500);
  }
}
