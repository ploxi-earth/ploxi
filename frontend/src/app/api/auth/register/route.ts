import { NextRequest } from 'next/server';
import { jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await req.json().catch(() => ({}));
    return jsonError(
      'Vendor registration uses email OTP. Please use /vendor/register and complete verification.',
      400
    );
  } catch (err: unknown) {
    console.error('Register error:', err);
    return jsonError('Internal server error.', 500);
  }
}
