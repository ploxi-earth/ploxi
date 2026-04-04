import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, 'platform_admin');

    const statuses = ['pending', 'approved', 'rejected', 'onboarding', 'onboarded'];
    const vendorCounts: Record<string, number> = {};

    const { count: total } = await supabase.from('vendors').select('*', { count: 'exact', head: true });
    vendorCounts.total = total || 0;

    for (const s of statuses) {
      const { count } = await supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', s);
      vendorCounts[s] = count || 0;
    }

    const { count: corporateCount } = await supabase.from('corporate_registrations').select('*', { count: 'exact', head: true });
    const { count: cleantechCount } = await supabase.from('cleantech_registrations').select('*', { count: 'exact', head: true });
    const { count: climateCount } = await supabase.from('climate_finance_registrations').select('*', { count: 'exact', head: true });

    return jsonOk({
      success: true,
      data: {
        vendors: vendorCounts,
        registrations: {
          corporate: corporateCount || 0,
          cleantech: cleantechCount || 0,
          climateFinance: climateCount || 0,
        },
      },
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
