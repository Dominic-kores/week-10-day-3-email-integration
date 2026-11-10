// services/emailService.js

const { Resend } = require("resend");

const { buildWelcomeEmail } =
  require("../emails/welcomeEmail");

const { buildPaymentReceiptEmail, formatKES } =
  require("../emails/paymentReceipt");

const { buildPasswordResetEmail } =
  require("../emails/passwordReset");

// Read sensitive configuration from environment variables.
const API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

if (!API_KEY || !FROM_EMAIL) {
  throw new Error(
    "RESEND_API_KEY and FROM_EMAIL must be set in .env"
  );
}

// Initialise the Resend client only once.
const resend = new Resend(API_KEY);

// Reusable delay helper for retry logic.
function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

// Base email service used by all email types.
async function sendEmail({ to, subject, html, text }) {
  const recipients = Array.isArray(to) ? to : [to];

  // Two attempts: original attempt + one retry.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: recipients,
        subject,
        html,
        text,
      });

      // Resend can return errors without throwing exceptions.
      if (error) {
        throw new Error(error.message || "Resend failed");
      }

      if (!data?.id) {
        throw new Error("Resend did not return an email ID");
      }

      console.log(
        `Email accepted by Resend. ID: ${data.id}`
      );

      return data;

    } catch (err) {
      console.error(
        `Email attempt ${attempt} failed: ${err.message}`
      );

      if (attempt === 2) {
        throw err;
      }

      console.warn("Retrying email in 1 second...");

      await sleep(1000);
    }
  }
}

// Convenience function: Welcome Email.
async function sendWelcomeEmail(user) {
  const { html, text } = buildWelcomeEmail({
    name: user.name,
  });

  return sendEmail({
    to: user.email,
    subject: "Welcome to PayLink",
    html,
    text,
  });
}

// Convenience function: Payment Receipt.
async function sendPaymentReceipt(transaction) {
  const { html, text } = buildPaymentReceiptEmail({
    amount: transaction.amount,
    phone: transaction.phone,
    transactionId: transaction.transactionId,
    merchantName: transaction.merchantName,
    paidAt: transaction.paidAt,
  });

  return sendEmail({
    to: transaction.email,
    subject:
      `Payment Receipt - ${formatKES(transaction.amount)}`,
    html,
    text,
  });
}

// Convenience function: Password Reset.
async function sendPasswordReset(user, token) {
  const { html, text } = buildPasswordResetEmail({
    name: user.name,
    email: user.email,
    token,
  });

  return sendEmail({
    to: user.email,
    subject: "Reset Your Password - PayLink",
    html,
    text,
  });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPaymentReceipt,
  sendPasswordReset,
};