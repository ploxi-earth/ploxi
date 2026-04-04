import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      engagementType, fullName, email, phone, organization, website,
      projectName, projectDescription, fundingRequired, projectStage, sector,
      investmentFocus, ticketSize, geographicPreference,
      participationType, areaOfInterest, message,
    } = body;

    const { data: registration, error } = await supabase
      .from('climate_finance_registrations')
      .insert({
        engagement_type: engagementType,
        full_name: fullName,
        email: email?.toLowerCase().trim(),
        phone,
        organization,
        website: website || null,
        project_name: projectName,
        project_description: projectDescription,
        funding_required: fundingRequired,
        project_stage: projectStage,
        sector,
        investment_focus: investmentFocus || [],
        ticket_size: ticketSize,
        geographic_preference: geographicPreference || [],
        participation_type: participationType,
        area_of_interest: areaOfInterest,
        message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Climate Finance registration error:', error);
      return jsonError('Registration failed.', 500);
    }

    return jsonOk({
      success: true,
      data: registration,
      message: 'Thank you! Your climate finance registration has been received.',
    }, 201);
  } catch (err: any) {
    console.error('Climate Finance register error:', err);
    return jsonError('Internal server error.', 500);
  }
}
