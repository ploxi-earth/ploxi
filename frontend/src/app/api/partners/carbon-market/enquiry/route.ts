import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsonOk, jsonError } from '@/lib/auth';

/**
 * POST /api/partners/carbon-market/enquiry
 * Inserts a carbon credit sourcing enquiry into Supabase.
 *
 * Required Supabase table: carbon_market_enquiries
 * SQL (run once in Supabase dashboard):
 *
 * create table if not exists carbon_market_enquiries (
 *   id              uuid primary key default gen_random_uuid(),
 *   full_name       text not null,
 *   work_email      text not null,
 *   company         text not null,
 *   country         text not null,
 *   estimated_credits text,
 *   preferred_category text,
 *   preferred_registry text,
 *   preferred_vintage  text,
 *   additional_requirements text,
 *   project_id      text,
 *   project_title   text,
 *   submitted_at    timestamptz default now(),
 *   status          text default 'new'
 * );
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      full_name, work_email, company, country,
      estimated_credits, preferred_category, preferred_registry,
      preferred_vintage, additional_requirements,
      project_id, project_title, submitted_at,
    } = body;

    // Basic server-side validation
    if (!full_name?.trim() || !work_email?.trim() || !company?.trim() || !country?.trim()) {
      return jsonError('Missing required fields: full_name, work_email, company, country.', 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(work_email)) {
      return jsonError('Invalid email address.', 400);
    }

    const { data, error } = await supabase
      .from('carbon_market_enquiries')
      .insert({
        full_name:               full_name.trim(),
        work_email:              work_email.trim().toLowerCase(),
        company:                 company.trim(),
        country:                 country.trim(),
        estimated_credits:       estimated_credits?.trim() || null,
        preferred_category:      preferred_category || null,
        preferred_registry:      preferred_registry || null,
        preferred_vintage:       preferred_vintage?.trim() || null,
        additional_requirements: additional_requirements?.trim() || null,
        project_id:              project_id || null,
        project_title:           project_title || null,
        submitted_at:            submitted_at || new Date().toISOString(),
        status:                  'new',
      })
      .select()
      .single();

    if (error) {
      console.error('[carbon-market/enquiry] Supabase error:', error);
      return jsonError('Failed to record enquiry. Please try again.', 500);
    }

    return jsonOk({ success: true, id: data.id, message: 'Your enquiry has been received.' }, 201);
  } catch (err) {
    console.error('[carbon-market/enquiry] Unexpected error:', err);
    return jsonError('Internal server error.', 500);
  }
}
