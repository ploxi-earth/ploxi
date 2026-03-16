const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {Object} opts - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'Ploxi Earth'}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
  logger.info(`Email sent: ${info.messageId} → ${to}`);
  return info;
};

module.exports = { sendEmail };
