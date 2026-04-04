import { NextRequest } from 'next/server';
import { requireAuth, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    return jsonOk({ success: true, user });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    return jsonError('Internal server error.', 500);
  }
}
