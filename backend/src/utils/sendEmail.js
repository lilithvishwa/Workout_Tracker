const nodemailer = require("nodemailer");

// Uses standard SMTP env vars. Works with Gmail (with an App Password),
// Resend, SendGrid SMTP, Mailgun SMTP, or any other SMTP provider.
function getTransporter() {
  if (!process.env.SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();

  if (!transporter) {
    // Dev fallback so you can test the flow before SMTP is configured —
    // the reset link is printed to the server logs instead of emailed.
    console.log("--- SMTP not configured. Email content below ---");
    console.log(`To: ${to}\nSubject: ${subject}\n${html}`);
    console.log("--------------------------------------------------");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
