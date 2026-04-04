import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth, requireRole, jsonOk, jsonError } from '@/lib/auth';

// GET /api/consultant/reports — all reports (manager/admin) or query param for /my
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const filterMy = searchParams.get('my');
    const status = searchParams.get('status');

    if (filterMy === 'true') {
      // Consultant's own reports
      const { data } = await supabase
        .from('sustainability_reports').select('*')
        .eq('consultant_id', user.id)
        .order('created_at', { ascending: false });
      return jsonOk({ success: true, data: data || [] });
    }

    // Manager/Admin: all reports
    if (!['manager', 'platform_admin'].includes(user.role)) {
      return jsonError('Access denied.', 403);
    }

    let query = supabase.from('sustainability_reports').select('*');
    if (status) query = query.eq('status', status);
    const { data } = await query.order('created_at', { ascending: false });

    // Enrich with consultant info
    const ids = [...new Set((data || []).map(r => r.consultant_id))];
    let consultants: Record<string, any> = {};
    if (ids.length > 0) {
      const { data: c } = await supabase.from('admin_users').select('id, name, email').in('id', ids);
      (c || []).forEach(u => { consultants[u.id] = u; });
    }

    return jsonOk({
      success: true,
      data: (data || []).map(r => ({ ...r, consultant: consultants[r.consultant_id] || null })),
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    return jsonError('Internal server error.', 500);
  }
}

// POST /api/consultant/reports — create report
export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, 'consultant');
    const body = await req.json();

    const { data, error } = await supabase.from('sustainability_reports').insert({
      consultant_id: user.id, client_name: body.clientName,
      reporting_period: body.reportingPeriod, reporting_year: body.reportingYear,
      energy_data: body.energyData, water_data: body.waterData,
      waste_data: body.wasteData, emissions_data: body.emissionsData,
      social_data: body.socialData, governance_data: body.governanceData,
      report_file_url: body.reportFileUrl, status: 'draft',
    }).select().single();

    if (error) throw error;
    return jsonOk({ success: true, data }, 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
