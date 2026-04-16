import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { splitFullName } from '@/lib/splitFullName';
import { jsonOk, jsonError } from '@/lib/auth';

/** Legacy non-OTP submit: inserts into the same per-track tables as the OTP flow. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      engagementType,
      fullName, email, phone, organization, website,
      projectName, projectDescription, fundingRequired, projectStage, sector,
      investmentFocus, ticketSize, geographicPreference,
      participationType, areaOfInterest, message,
    } = body;

    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';
    if (!em || !engagementType) {
      return jsonError('Email and engagement type are required.', 400);
    }

    if (engagementType === 'raise_funding') {
      const companyName =
        String(organization || '').trim() ||
        String(projectName || '').trim() ||
        String(fullName || '').trim() ||
        null;

      const { data: registration, error } = await supabase
        .from('raise_funding_registrations')
        .insert({
          email: em,
          company_name: companyName,
          full_name: String(fullName || '').trim() || null,
          phone: phone || null,
          organization: organization || null,
          project_name: projectName || null,
          project_description: projectDescription || null,
          funding_required: fundingRequired || null,
          project_stage: projectStage || null,
          sector: sector || null,
          funding_stage: projectStage || null,
          funding_amount: fundingRequired || null,
          funding_purpose: projectDescription || null,
          email_verified: true,
          status: 'completed',
          completed_at: new Date().toISOString(),
          user_type: 'raise_funding',
        })
        .select()
        .single();

      if (error) {
        console.error('Climate raise_funding insert', error);
        return jsonError('Registration failed.', 500);
      }
      return jsonOk({ success: true, data: registration, message: 'Thank you! Your registration has been received.' }, 201);
    }

    if (engagementType === 'investor') {
      const { first_name, last_name } = splitFullName(String(fullName || ''));
      const { data: registration, error } = await supabase
        .from('investor_registrations')
        .insert({
          email: em,
          first_name: first_name || null,
          last_name: last_name || null,
          phone: phone || null,
          organization_name: organization || null,
          website: website || null,
          sectors_of_interest: investmentFocus || [],
          geographic_focus: geographicPreference || [],
          typical_ticket_size: ticketSize || null,
          email_verified: true,
          status: 'completed',
          completed_at: new Date().toISOString(),
          user_type: 'investor',
        })
        .select()
        .single();

      if (error) {
        console.error('Climate investor insert', error);
        return jsonError('Registration failed.', 500);
      }
      return jsonOk({ success: true, data: registration, message: 'Thank you! Your registration has been received.' }, 201);
    }

    if (engagementType === 'participate') {
      const { first_name, last_name } = splitFullName(String(fullName || ''));
      const pt = String(participationType || '').trim();
      const { data: registration, error } = await supabase
        .from('participant_registrations')
        .insert({
          email: em,
          first_name: first_name || '',
          last_name: last_name || '',
          organization: String(organization || '').trim() || '',
          intent_type: pt ? [pt] : [],
          email_verified: true,
          status: 'completed',
          user_type: 'participant',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Climate participant insert', error);
        return jsonError('Registration failed.', 500);
      }
      return jsonOk({ success: true, data: registration, message: 'Thank you! Your registration has been received.' }, 201);
    }

    return jsonError('Invalid engagement type.', 400);
  } catch (err: unknown) {
    console.error('Climate Finance register error:', err);
    return jsonError('Internal server error.', 500);
  }
}
