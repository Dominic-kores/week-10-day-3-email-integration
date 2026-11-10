// emails/welcomeEmail.js

const {
  escapeHtml,
  emailLayout,
  emailButton,
} = require("./layout");

// Build welcome email from the new user's name.
function buildWelcomeEmail({ name }) {
  const firstName = String(name).trim().split(/\s+/)[0];

  const safeName = escapeHtml(firstName);

  const appUrl =
    process.env.APP_URL || "https://paylink.example.com";

  const dashboardUrl = `${appUrl}/dashboard`;

  const content = `
    <h2
      style="
        color:#102a43;
        font-size:24px;
        margin-top:0;
      "
    >
      Welcome, ${safeName}!
    </h2>

    <p>
      Thank you for joining <strong>PayLink</strong>.
      We are excited to have you on board!
    </p>

    <p>
      Your account is ready. You can now create payment
      links and start accepting secure M-Pesa payments
      from customers across Kenya.
    </p>

    <h3 style="color:#102a43;">
      Get Started in 4 Easy Steps
    </h3>

    <ol style="padding-left:22px;">
      <li style="padding-bottom:10px;">
        Log in to your PayLink dashboard.
      </li>

      <li style="padding-bottom:10px;">
        Create your first payment link.
      </li>

      <li style="padding-bottom:10px;">
        Share the link with your customer.
      </li>

      <li style="padding-bottom:10px;">
        Get paid instantly via M-Pesa.
      </li>
    </ol>

    ${emailButton("Go to Dashboard", dashboardUrl)}

    <p>
      We are here to help you receive payments quickly,
      safely, and conveniently.
    </p>

    <p>
      Happy selling!<br />
      <strong>The PayLink Team</strong>
    </p>

    <hr style="border:0;border-top:1px solid #e2e8f0;" />

    <p style="color:#64748b;font-size:12px;">
      You received this email because you created
      a PayLink account.
    </p>
  `;

  // Plain text alternative for clients without HTML support.
  const text = `
Welcome, ${firstName}!

Thank you for joining PayLink.

Your account is ready, and you can now start
accepting M-Pesa payments.

Get started:

1. Log in to your dashboard.
2. Create your first payment link.
3. Share the link with your customer.
4. Get paid via M-Pesa instantly.

Dashboard: ${dashboardUrl}

Happy selling!
The PayLink Team

You received this email because you created
a PayLink account.
  `.trim();

  return {
    html: emailLayout(content),
    text,
  };
}

module.exports = { buildWelcomeEmail };