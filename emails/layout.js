// emails/layout.js

// Prevent dynamic content from injecting unwanted HTML.
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

// Shared header used by all templates.
function emailHeader() {
  return `
    <tr>
      <td
        align="center"
        style="
          background-color: #102a43;
          padding: 30px 20px;
        "
      >
        <h1
          style="
            color: #ffffff;
            font-size: 30px;
            margin: 0;
            font-family: Arial, sans-serif;
          "
        >
          PayLink
        </h1>

        <p
          style="
            color: #c9d8e7;
            font-size: 13px;
            margin: 8px 0 0;
          "
        >
          Simple, Secure M-Pesa Payments
        </p>
      </td>
    </tr>
  `;
}

// Shared footer used by all templates.
function emailFooter() {
  const supportEmail =
    process.env.SUPPORT_EMAIL || "support@example.com";

  const safeSupport = escapeHtml(supportEmail);

  return `
    <tr>
      <td
        align="center"
        style="
          background-color: #f1f5f9;
          padding: 24px 18px;
          font-family: Arial, sans-serif;
        "
      >
        <p style="color:#64748b;font-size:12px;">
          © 2026 PayLink. All rights reserved.
        </p>

        <p style="font-size:12px;">
          <a
            href="mailto:${safeSupport}"
            style="color:#0066ff;"
          >
            Contact Support
          </a>
        </p>

        <p style="font-size:12px;">
          <a href="https://twitter.com" style="color:#475569;">
            Twitter
          </a>
          &nbsp; | &nbsp;
          <a href="https://linkedin.com" style="color:#475569;">
            LinkedIn
          </a>
          &nbsp; | &nbsp;
          <a href="https://github.com" style="color:#475569;">
            GitHub
          </a>
        </p>
      </td>
    </tr>
  `;
}

// Complete email wrapper.
// All styles are inline for email client compatibility.
function emailLayout(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>PayLink Email</title>
      </head>

      <body
        style="
          margin:0;
          padding:20px 10px;
          background-color:#eef2f7;
          font-family:Arial,Helvetica,sans-serif;
        "
      >
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="width:100%;border-collapse:collapse;"
        >
          <tr>
            <td align="center">

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="
                  width:100%;
                  max-width:600px;
                  background:#ffffff;
                  border:1px solid #e2e8f0;
                  border-radius:10px;
                  overflow:hidden;
                  border-collapse:separate;
                "
              >
                ${emailHeader()}

                <tr>
                  <td
                    style="
                      padding:32px 24px;
                      color:#334155;
                      font-size:15px;
                      line-height:1.7;
                    "
                  >
                    ${content}
                  </td>
                </tr>

                ${emailFooter()}
              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// Shared call-to-action button.
function emailButton(label, url, color = "#0066ff") {
  return `
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="margin:26px auto;"
    >
      <tr>
        <td
          align="center"
          bgcolor="${color}"
          style="border-radius:8px;"
        >
          <a
            href="${escapeHtml(url)}"
            style="
              display:inline-block;
              background-color:${color};
              color:#ffffff;
              padding:14px 32px;
              border-radius:8px;
              text-decoration:none;
              font-size:15px;
              font-weight:bold;
            "
          >
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

module.exports = {
  escapeHtml,
  emailHeader,
  emailFooter,
  emailLayout,
  emailButton,
};