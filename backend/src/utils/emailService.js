const { sendEmail } = require('../config/mailer');

const emailTemplates = {
  vendorRegistration: (vendorName) => ({
    subject: 'Registration Received – Ploxi Earth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to Ploxi Earth, ${vendorName}!</h2>
        <p>Thank you for registering as a Clean Tech Vendor on Ploxi Earth. Your application is currently under review.</p>
        <p>Our team will review your application and get back to you shortly.</p>
        <p style="color: #6b7280; font-size: 14px;">Team Ploxi Earth | <a href="https://www.ploxi.earth">ploxi.earth</a></p>
      </div>`,
  }),

  vendorApproved: (vendorName, loginUrl) => ({
    subject: 'Application Approved – Ploxi Earth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Congratulations, ${vendorName}!</h2>
        <p>Your vendor application has been <strong>approved</strong> by the Ploxi Earth team.</p>
        <p>You can now log in to complete your company profile and begin the onboarding process.</p>
        <a href="${loginUrl}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Log In Now</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Team Ploxi Earth</p>
      </div>`,
  }),

  vendorRejected: (vendorName, reason) => ({
    subject: 'Application Status Update – Ploxi Earth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Application Update</h2>
        <p>Dear ${vendorName},</p>
        <p>Thank you for your interest in partnering with Ploxi Earth. After careful review, we are unable to proceed with your application at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>We encourage you to re-apply in the future. If you have questions, please contact <a href="mailto:support@ploxi.earth">support@ploxi.earth</a>.</p>
        <p style="color: #6b7280; font-size: 14px;">Team Ploxi Earth</p>
      </div>`,
  }),

  vendorInvite: (inviteUrl) => ({
    subject: 'You\'re Invited to Join Ploxi Earth as a Vendor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">You're Invited!</h2>
        <p>You have been invited by the Ploxi Earth team to register as a Clean Tech Vendor on our platform.</p>
        <a href="${inviteUrl}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Accept Invitation</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This invitation link expires in 7 days.</p>
        <p style="color: #6b7280; font-size: 14px;">Team Ploxi Earth</p>
      </div>`,
  }),

  agreementSent: (vendorName, agreementUrl) => ({
    subject: 'Partnership Agreement – Ploxi Earth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Partnership Agreement Ready</h2>
        <p>Dear ${vendorName},</p>
        <p>Your partnership agreement has been prepared. Please review and sign the agreement to complete your onboarding.</p>
        <a href="${agreementUrl}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">View Agreement</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Team Ploxi Earth</p>
      </div>`,
  }),

  meetingScheduled: (vendorName, date, time) => ({
    subject: 'Intro Meeting Scheduled – Ploxi Earth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Meeting Scheduled</h2>
        <p>Dear ${vendorName},</p>
        <p>An introductory meeting has been scheduled with the Ploxi Earth team.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>Our team will reach out with the meeting link separately.</p>
        <p style="color: #6b7280; font-size: 14px;">Team Ploxi Earth</p>
      </div>`,
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request – Ploxi Earth',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Reset Your Password</h2>
        <p>You requested a password reset for your Ploxi Earth account.</p>
        <a href="${resetUrl}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Reset Password</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link expires in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>`,
  }),
};

/**
 * Send a named template email
 * @param {string} template - template key
 * @param {string} to - recipient email
 * @param {Array} args - template arguments
 */
const sendTemplatedEmail = async (template, to, ...args) => {
  const { subject, html } = emailTemplates[template](...args);
  return sendEmail({ to, subject, html });
};

module.exports = { sendTemplatedEmail, emailTemplates };
