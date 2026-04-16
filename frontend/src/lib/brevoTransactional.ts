/**
 * Brevo Transactional Email API (HTTPS) — not Nodemailer / SMTP client.
 * Configure BREVO_API_KEY and BREVO_SENDER_EMAIL in the environment.
 */

type BrevoRecipient = { email: string; name?: string };

export async function sendBrevoTransactional(params: {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Ploxi Earth';

  if (!apiKey || !senderEmail) {
    console.warn('[brevo] BREVO_API_KEY or BREVO_SENDER_EMAIL missing — email skipped.');
    return { ok: false, error: 'Email not configured' };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[brevo] API error', res.status, text);
      return { ok: false, error: text || res.statusText };
    }
    return { ok: true };
  } catch (e) {
    console.error('[brevo] send failed', e);
    return { ok: false, error: e instanceof Error ? e.message : 'send failed' };
  }
}

export function adminDashboardVendorsUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/admin/vendors`;
}
