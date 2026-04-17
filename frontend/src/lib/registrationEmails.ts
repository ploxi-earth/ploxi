import { adminDashboardVendorsUrl, sendBrevoTransactional } from '@/lib/brevoTransactional';
import { supabase } from '@/lib/supabase';

export async function notifyAdminsNewVendor(companyName: string, contactPerson: string, vendorEmail: string) {
  const { data: admins } = await supabase
    .from('admin_users')
    .select('email, name')
    .eq('is_active', true)
    .in('role', ['platform_admin']);

  const emails = (admins || [])
    .map((a) => a.email)
    .filter((e): e is string => typeof e === 'string' && e.includes('@'));

  if (emails.length === 0) {
    console.warn('[email] No active platform_admin emails for new-vendor notification.');
    return;
  }

  const dashboardUrl = adminDashboardVendorsUrl();
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">New Vendor Application</h2>
        <p>A new vendor has registered on Ploxi Earth and is awaiting your review.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Company:</td><td style="padding: 8px; color: #6b7280;">${escapeHtml(companyName)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Contact:</td><td style="padding: 8px; color: #6b7280;">${escapeHtml(contactPerson)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px; color: #6b7280;">${escapeHtml(vendorEmail)}</td></tr>
        </table>
        <a href="${dashboardUrl}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Review Application</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Ploxi Earth Admin System</p>
      </div>`;

  await sendBrevoTransactional({
    to: emails.map((email) => ({ email })),
    subject: `New Vendor Application – ${companyName}`,
    htmlContent: html,
  });
}

export async function sendVendorMeetingScheduledEmail(
  toEmail: string,
  vendorName: string,
  date: string,
  time: string,
  meetingLink: string
) {
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Technical Meeting Scheduled</h2>
        <p>Dear ${escapeHtml(vendorName)},</p>
        <p>A technical meeting has been scheduled with the Ploxi Earth team.</p>
        <p><strong>Date:</strong> ${escapeHtml(date)}</p>
        <p><strong>Time:</strong> ${escapeHtml(time)}</p>
        ${
          meetingLink
            ? `<p><strong>Meeting Link:</strong></p><a href="${escapeAttr(meetingLink)}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 6px;">Join Meeting</a>`
            : '<p>The meeting link will be shared separately.</p>'
        }
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Team Ploxi Earth</p>
      </div>`;

  await sendBrevoTransactional({
    to: [{ email: toEmail }],
    subject: 'Technical Meeting Scheduled – Ploxi Earth',
    htmlContent: html,
  });
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string) {
  return String(s).replace(/"/g, '&quot;');
}
