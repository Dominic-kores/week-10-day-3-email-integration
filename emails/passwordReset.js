// emails/passwordReset.js

const {
  escapeHtml,
  emailLayout,
  emailButton,
} = require("./layout");

function buildPasswordResetEmail({ name, email, token }) {
  const firstName = String(name).trim().split(/\s+/)[0];

  const appUrl =
    process.env.APP_URL || "https://paylink.example.com";

  const resetUrl =
    `${appUrl}/reset-password?token=${
      encodeURIComponent(token)
    }&email=${encodeURIComponent(email)}`;

  const content = `
    <h2 style="color:#102a43;">
      Reset Your Password
    </h2>

    <p>
      Hello ${escapeHtml(firstName)},
    </p>

    <p>
      We received a request to reset the password
      associated with your PayLink account.
    </p>

    <p>
      Click the button below to create a new password.
    </p>

    ${emailButton("Reset Password", resetUrl)}

    <p
      style="
        color:#dc2626;
        font-weight:bold;
        text-align:center;
      "
    >
      This link expires in 1 hour.
    </p>

    <p>
      If the button does not work, copy and paste
      this URL into your browser:
    </p>

    <p
      style="
        font-size:12px;
        overflow-wrap:anywhere;
        word-break:break-word;
      "
    >
      <a
        href="${escapeHtml(resetUrl)}"
        style="color:#0066ff;"
      >
        ${escapeHtml(resetUrl)}
      </a>
    </p>

    <p>
      If you did not request this password reset,
      please ignore this email.
    </p>

    <p>
      Regards,<br />
      <strong>The PayLink Security Team</strong>
    </p>
  `;

  const text = `
Hello ${firstName},

We received a request to reset your PayLink password.

Reset your password using this link:

${resetUrl}

This link expires in 1 hour.

If you did not request this password reset,
please ignore this email.

The PayLink Security Team
  `.trim();

  return {
    html: emailLayout(content),
    text,
  };
}

module.exports = { buildPasswordResetEmail };