import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const { data: vendorRow } = await supabase.from('vendors').select('logo_url').eq('id', vendorId).maybeSingle();

    const [
      { count: totalServices },
      { count: activeServices },
      { count: totalProjects },
      { count: activeProjects },
      { count: completedProjects },
      { count: unreadNotifications },
    ] = await Promise.all([
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId).eq('status', 'active'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId).in('status', ['opportunity', 'proposal', 'in_progress']),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId).eq('status', 'completed'),
      supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
    ]);

    const { data: completedProjectsData } = await supabase
      .from('projects').select('value').eq('vendor_id', vendorId).eq('status', 'completed');

    const projectRevenue = (completedProjectsData || []).reduce((sum, p) => sum + (Number(p.value) || 0), 0);

    // Revenue should only reflect realized marketplace deals.
    // Service pricing is not considered revenue until client/deal flow is implemented.
    const totalRevenue = projectRevenue;

    const [{ data: recentProjects }, { data: recentNotifications }] = await Promise.all([
      supabase.from('projects').select('*').eq('vendor_id', vendorId).order('updated_at', { ascending: false }).limit(5),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    ]);

    return jsonOk({
      success: true,
      data: {
        logoUrl: vendorRow?.logo_url ?? null,
        stats: {
          totalServices: totalServices || 0, activeServices: activeServices || 0,
          totalProjects: totalProjects || 0, activeProjects: activeProjects || 0,
          completedProjects: completedProjects || 0, totalRevenue,
          unreadNotifications: unreadNotifications || 0,
        },
        recentProjects: recentProjects || [],
        recentNotifications: recentNotifications || [],
      },
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
