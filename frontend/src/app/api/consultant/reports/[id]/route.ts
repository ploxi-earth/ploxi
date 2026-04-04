import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth, requireRole, jsonOk, jsonError } from '@/lib/auth';

// GET /api/consultant/reports/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    const { data } = await supabase.from('sustainability_reports').select('*').eq('id', params.id).single();
    if (!data) return jsonError('Report not found.', 404);

    const { data: consultant } = await supabase.from('admin_users').select('id, name, email').eq('id', data.consultant_id).single();
    return jsonOk({ success: true, data: { ...data, consultant: consultant || null } });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    return jsonError('Internal server error.', 500);
  }
}

// PUT /api/consultant/reports/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(req, 'consultant');
    const body = await req.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    const map: Record<string, string> = {
      clientName: 'client_name', reportingPeriod: 'reporting_period', reportingYear: 'reporting_year',
      energyData: 'energy_data', waterData: 'water_data', wasteData: 'waste_data',
      emissionsData: 'emissions_data', socialData: 'social_data', governanceData: 'governance_data',
      reportFileUrl: 'report_file_url',
    };
    for (const [k, v] of Object.entries(map)) if (body[k] !== undefined) updates[v] = body[k];

    const { data, error } = await supabase
      .from('sustainability_reports').update(updates)
      .eq('id', params.id).eq('consultant_id', user.id).select().single();

    if (error || !data) return jsonError('Report not found or access denied.', 404);
    return jsonOk({ success: true, data });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}

// PATCH /api/consultant/reports/[id] — submit / approve / publish
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action'); // submit, approve, publish

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (action === 'submit') {
      updates.status = 'submitted';
    } else if (action === 'approve') {
      if (!['manager', 'platform_admin'].includes(user.role)) return jsonError('Access denied.', 403);
      updates.status = 'approved';
      updates.approved_by = user.id;
      updates.approved_at = new Date().toISOString();
    } else if (action === 'publish') {
      if (!['manager', 'platform_admin'].includes(user.role)) return jsonError('Access denied.', 403);
      updates.status = 'published';
      updates.published_at = new Date().toISOString();
    } else {
      return jsonError('Invalid action. Use ?action=submit|approve|publish', 400);
    }

    const { data, error } = await supabase
      .from('sustainability_reports').update(updates)
      .eq('id', params.id).select().single();

    if (error || !data) return jsonError('Report not found.', 404);
    return jsonOk({ success: true, data });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    return jsonError('Internal server error.', 500);
  }
}
