import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, designation, companyName, website, industrySector, customIndustry,
      email, phone, countryCode,
      currentEsgFrameworks, esgReportingStatus, primaryEsgGoals,
      complianceRegulations, annualRevenueBand, employeeCount, sustainabilityTeamSize,
      hearAboutUs, additionalNotes,
      geography, esgFrameworks, sustainabilityStage, esgSaasIntegration,
    } = body;

    const { data: registration, error } = await supabase
      .from('corporate_registrations')
      .insert({
        full_name: fullName,
        designation,
        company_name: companyName,
        website: website || null,
        industry_sector: industrySector === 'Other' ? customIndustry : industrySector,
        custom_industry: industrySector === 'Other' ? customIndustry : null,
        email: email?.toLowerCase().trim(),
        phone: countryCode ? `${countryCode}${phone}` : phone,
        current_esg_frameworks: currentEsgFrameworks || [],
        esg_reporting_status: esgReportingStatus,
        primary_esg_goals: primaryEsgGoals || [],
        compliance_regulations: complianceRegulations || [],
        annual_revenue_band: annualRevenueBand,
        employee_count: employeeCount,
        sustainability_team_size: sustainabilityTeamSize,
        hear_about_us: hearAboutUs,
        additional_notes: additionalNotes,
        geography: geography || null,
        esg_frameworks: esgFrameworks || null,
        sustainability_stage: sustainabilityStage || null,
        esg_saas_integration: esgSaasIntegration || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Corporate registration error:', error);
      return jsonError('Registration failed.', 500);
    }

    return jsonOk({
      success: true,
      data: registration,
      message: 'Thank you! Your registration has been received.',
    }, 201);
  } catch (err: any) {
    console.error('Corporate register error:', err);
    return jsonError('Internal server error.', 500);
  }
}
