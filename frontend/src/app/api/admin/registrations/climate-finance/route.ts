import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import {
  mapInvestorRow,
  mapLegacyClimateRow,
  mapParticipantRow,
  mapRaiseFundingRow,
  type ClimateRegRow,
} from '@/lib/climateFinanceAdminMaps';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, 'platform_admin');
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const engagementType = searchParams.get('engagementType');
    const page = Number(searchParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    const applyStatus = (query: any) => (status ? query.eq('status', status) : query);
    const countTable = async (table: string) => {
      const { count } = await applyStatus(
        supabase.from(table).select('*', { count: 'exact', head: true })
      );
      return count || 0;
    };

    if (engagementType === 'raise_funding') {
      let q = supabase.from('raise_funding_registrations').select('*', { count: 'exact' });
      if (status) q = q.eq('status', status);
      const { data, count } = await q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      const registrations = (data || []).map((r) => mapRaiseFundingRow(r as Record<string, unknown>));
      return jsonOk({
        success: true,
        data: { registrations, pagination: { total: count || 0, page, limit } },
      });
    }

    if (engagementType === 'investor') {
      let q = supabase.from('investor_registrations').select('*', { count: 'exact' });
      if (status) q = q.eq('status', status);
      const { data, count } = await q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      const registrations = (data || []).map((r) => mapInvestorRow(r as Record<string, unknown>));
      return jsonOk({
        success: true,
        data: { registrations, pagination: { total: count || 0, page, limit } },
      });
    }

    if (engagementType === 'participate') {
      let q = supabase.from('participant_registrations').select('*', { count: 'exact' });
      if (status) q = q.eq('status', status);
      const { data, count } = await q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      const registrations = (data || []).map((r) => mapParticipantRow(r as Record<string, unknown>));
      return jsonOk({
        success: true,
        data: { registrations, pagination: { total: count || 0, page, limit } },
      });
    }

    // No type filter: merge recent rows from all sources (page > 1 needs a type for DB-level pagination)
    if (page > 1) {
      return jsonError('Select an engagement type to view page 2 and beyond.', 400);
    }

    const per = 40;
    const [rf, inv, part, leg] = await Promise.all([
      applyStatus(supabase.from('raise_funding_registrations').select('*')).order('created_at', { ascending: false }).limit(per),
      applyStatus(supabase.from('investor_registrations').select('*')).order('created_at', { ascending: false }).limit(per),
      applyStatus(supabase.from('participant_registrations').select('*')).order('created_at', { ascending: false }).limit(per),
      applyStatus(supabase.from('climate_finance_registrations').select('*')).order('created_at', { ascending: false }).limit(per),
    ]);

    const merged: ClimateRegRow[] = [
      ...(rf.data || []).map((r: Record<string, unknown>) => mapRaiseFundingRow(r)),
      ...(inv.data || []).map((r: Record<string, unknown>) => mapInvestorRow(r)),
      ...(part.data || []).map((r: Record<string, unknown>) => mapParticipantRow(r)),
      ...(leg.data || []).map((r: Record<string, unknown>) => mapLegacyClimateRow(r)),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const slice = merged.slice(0, limit);
    const [cRf, cInv, cPart, cLeg] = await Promise.all([
      countTable('raise_funding_registrations'),
      countTable('investor_registrations'),
      countTable('participant_registrations'),
      countTable('climate_finance_registrations'),
    ]);
    const total = cRf + cInv + cPart + cLeg;

    return jsonOk({
      success: true,
      data: {
        registrations: slice,
        pagination: { total, page: 1, limit: slice.length },
        mergedView: true,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
