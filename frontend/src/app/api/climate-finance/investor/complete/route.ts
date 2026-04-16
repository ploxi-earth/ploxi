import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsonError, jsonOk } from '@/lib/auth';

function cleanString(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s.length > 0 ? s : null;
}

function cleanArray(val: unknown): string[] | null {
  if (!Array.isArray(val) || val.length === 0) return null;
  const arr = val.map((v) => String(v).trim()).filter(Boolean);
  return arr.length > 0 ? arr : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = cleanString(body?.email)?.toLowerCase();
    if (!email) return jsonError('Email is required.', 400);

    const { data: existing } = await supabase
      .from('investor_registrations')
      .select('id, email_verified')
      .eq('email', email)
      .maybeSingle();

    if (!existing) return jsonError('Investor profile not found. Verify email first.', 404);
    if (!existing.email_verified) return jsonError('Please verify OTP before completing profile.', 403);

    const payload = {
      first_name: cleanString(body.first_name),
      last_name: cleanString(body.last_name) || 'N/A',
      phone: cleanString(body.phone),
      linkedin_url: cleanString(body.linkedin_url),
      designation: cleanString(body.designation),
      organization_name: cleanString(body.organization_name),
      fund_name: cleanString(body.fund_name),
      organization_type: cleanString(body.organization_type) || 'Other',
      fund_size: cleanString(body.fund_size),
      fund_size_range: cleanString(body.fund_size_range),
      aum: cleanString(body.aum),
      fund_vintage: cleanString(body.fund_vintage),
      website: cleanString(body.website),
      sectors_of_interest: cleanArray(body.sectors_of_interest),
      investment_stages: cleanArray(body.investment_stages),
      geographic_focus: cleanArray(body.geographic_focus),
      typical_ticket_size: cleanString(body.typical_ticket_size),
      min_investment: cleanString(body.min_investment),
      max_investment: cleanString(body.max_investment),
      financing_types: cleanArray(body.financing_types),
      investment_structures: cleanArray(body.investment_structures),
      esg_focus: cleanArray(body.esg_focus),
      impact_metrics: cleanArray(body.impact_metrics),
      certifications: cleanArray(body.certifications),
      sdg_alignment: cleanArray(body.sdg_alignment),
      investment_criteria: cleanString(body.investment_criteria),
      portfolio_companies: cleanString(body.portfolio_companies),
      recent_investments: cleanString(body.recent_investments),
      value_add: cleanString(body.value_add),
      decision_timeline: cleanString(body.decision_timeline),
      due_diligence_process: cleanString(body.due_diligence_process),
      status: 'completed',
      completed_at: new Date().toISOString(),
      user_type: 'investor',
    };

    const { error } = await supabase
      .from('investor_registrations')
      .update(payload)
      .eq('email', email);

    if (error) {
      console.error('investor complete', error);
      return jsonError('Could not save investor profile.', 500);
    }

    return jsonOk({ success: true, message: 'Investor profile submitted successfully.' });
  } catch (e: unknown) {
    console.error('investor complete', e);
    return jsonError('Internal server error.', 500);
  }
}
