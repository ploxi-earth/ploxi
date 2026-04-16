import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSupabaseAnonAuthClient } from '@/lib/supabaseAnonAuth';
import { jsonOk, jsonError } from '@/lib/auth';

type FormDataPayload = Record<string, unknown>;

function cleanString(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s.length > 0 ? s : null;
}

function cleanArray(val: unknown): string[] | null {
  if (!Array.isArray(val) || val.length === 0) return null;
  const arr = val
    .map((v) => String(v).trim())
    .filter(Boolean);
  return arr.length > 0 ? arr : null;
}

function pickString(fd: FormDataPayload, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = cleanString(fd[key]);
    if (value) return value;
  }
  return null;
}

function splitName(fullName: string | null): { first: string | null; last: string | null } {
  if (!fullName) return { first: null, last: null };
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: null, last: null };
  if (parts.length === 1) return { first: parts[0], last: null };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, formData } = body as { email?: string; formData?: FormDataPayload };

    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';
    if (!em || !em.includes('@')) {
      return jsonError('Valid email required.', 400);
    }

    const fd = formData || {};

    const { data: existing } = await supabase
      .from('investor_registrations')
      .select('email, email_verified')
      .eq('email', em)
      .maybeSingle();

    if (existing?.email_verified) {
      return jsonError('This email is already registered.', 400);
    }

    const fullName = pickString(fd, 'fullName');
    const nameParts = splitName(fullName);

    // Full schema mapping (camelCase + snake_case compatible)
    const dataToSave = {
      // Personal
      first_name: pickString(fd, 'first_name', 'firstName') || nameParts.first,
      last_name: pickString(fd, 'last_name', 'lastName') || nameParts.last || 'N/A',
      email: em,
      phone: pickString(fd, 'phone'),
      linkedin_url: pickString(fd, 'linkedin_url', 'linkedIn'),
      designation: pickString(fd, 'designation'),

      // Organization
      organization_name: pickString(fd, 'organization_name', 'organizationName', 'organization'),
      fund_name: pickString(fd, 'fund_name', 'fundName'),
      organization_type: pickString(fd, 'organization_type', 'organizationType') || 'Other',
      fund_size: pickString(fd, 'fund_size', 'fundSize'),
      fund_size_range: pickString(fd, 'fund_size_range', 'fundSizeRange'),
      aum: pickString(fd, 'aum'),
      fund_vintage: pickString(fd, 'fund_vintage', 'fundVintage'),
      website: pickString(fd, 'website'),

      // Investment Focus
      sectors_of_interest: cleanArray(fd.sectors_of_interest ?? fd.sectors) ?? [],
      investment_stages: cleanArray(fd.investment_stages ?? fd.investmentStages) ?? [],
      geographic_focus: cleanArray(fd.geographic_focus ?? fd.geographicFocus) ?? [],
      typical_ticket_size: pickString(fd, 'typical_ticket_size', 'typicalTicketSize', 'ticketSize'),
      min_investment: pickString(fd, 'min_investment', 'minInvestment'),
      max_investment: pickString(fd, 'max_investment', 'maxInvestment'),

      // Financing
      financing_types: cleanArray(fd.financing_types ?? fd.financingTypes) ?? [],
      investment_structures: cleanArray(fd.investment_structures ?? fd.investmentStructures) ?? [],

      // ESG
      esg_focus: cleanArray(fd.esg_focus ?? fd.esgFocus) ?? [],
      impact_metrics: cleanArray(fd.impact_metrics ?? fd.impactMetrics) ?? [],
      certifications: cleanArray(fd.certifications) ?? [],
      sdg_alignment: cleanArray(fd.sdg_alignment ?? fd.sdgAlignment) ?? [],

      // Additional
      investment_criteria: pickString(fd, 'investment_criteria', 'investmentCriteria'),
      portfolio_companies: pickString(fd, 'portfolio_companies', 'portfolioCompanies'),
      recent_investments: pickString(fd, 'recent_investments', 'recentInvestments'),
      value_add: pickString(fd, 'value_add', 'valueAdd'),
      decision_timeline: pickString(fd, 'decision_timeline', 'decisionTimeline'),
      due_diligence_process: pickString(fd, 'due_diligence_process', 'dueDiligenceProcess'),

      // Metadata
      email_verified: false,
      status: 'pending',
      user_type: 'investor',
    };

    const query = existing
      ? supabase.from('investor_registrations').update(dataToSave).eq('email', em)
      : supabase.from('investor_registrations').insert(dataToSave);

    const { error } = await query;

    if (error) {
      console.error('investor save error', error);
      return jsonError('Could not save registration.', 500);
    }

    // OTP
    const auth = createSupabaseAnonAuthClient();
    const { error: otpError } = await auth.auth.signInWithOtp({
      email: em,
      options: { shouldCreateUser: true },
    });

    if (otpError) {
      console.error('investor OTP send', otpError);
      if (otpError.message?.toLowerCase().includes('rate limit')) {
        return jsonError('Too many OTP requests. Please wait a few minutes and try again.', 429);
      }
      return jsonError('Failed to send OTP.', 503);
    }

    return jsonOk({ success: true, message: 'OTP sent to your email.' });

  } catch (e: unknown) {
    console.error('investor send-otp', e);
    return jsonError('Failed to send OTP.', 500);
  }
}