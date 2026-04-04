import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName, website, solutionType, targetIndustries, geographicRegions,
      contactName, contactEmail, companyDescription,
      revenueStage, teamSize, fundingStatus, keyDifferentiators,
      clientsServed, partnershipGoals,
    } = body;

    const { data: registration, error } = await supabase
      .from('cleantech_registrations')
      .insert({
        company_name: companyName,
        website: website || null,
        solution_type: solutionType,
        target_industries: targetIndustries || [],
        geographic_regions: geographicRegions || [],
        contact_name: contactName,
        contact_email: contactEmail?.toLowerCase().trim(),
        company_description: companyDescription,
        revenue_stage: revenueStage,
        team_size: teamSize,
        funding_status: fundingStatus,
        key_differentiators: keyDifferentiators,
        clients_served: clientsServed,
        partnership_goals: partnershipGoals || [],
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('CleanTech registration error:', error);
      return jsonError('Registration failed.', 500);
    }

    return jsonOk({
      success: true,
      data: registration,
      message: 'Thank you! Your clean tech registration has been received.',
    }, 201);
  } catch (err: any) {
    console.error('CleanTech register error:', err);
    return jsonError('Internal server error.', 500);
  }
}
