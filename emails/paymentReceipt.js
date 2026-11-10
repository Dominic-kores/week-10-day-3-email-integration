// emails/paymentReceipt.js

const {
  escapeHtml,
  emailLayout,
  emailButton,
} = require("./layout");

// Format money in Kenyan shillings.
function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

// Hide all phone digits except the last four.
function maskPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");

  return "*".repeat(Math.max(0, digits.length - 4)) +
    digits.slice(-4);
}

// Use East African Time regardless of server location.
function formatKenyanDate(date) {
  return new Date(date).toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  });
}

function buildPaymentReceiptEmail({
  amount,
  phone,
  transactionId,
  merchantName,
  paidAt,
}) {
  const formattedAmount = formatKES(amount);
  const maskedPhone = maskPhone(phone);
  const formattedDate = formatKenyanDate(paidAt);

  const appUrl =
    process.env.APP_URL || "https://paylink.example.com";

  const transactionUrl =
    `${appUrl}/transactions/${encodeURIComponent(transactionId)}`;

  // Use a reusable function for each receipt row.
  function detailRow(label, value) {
    return `
      <tr>
        <td
          style="
            padding:12px;
            border-bottom:1px solid #e2e8f0;
            color:#64748b;
            font-size:13px;
            width:38%;
          "
        >
          ${escapeHtml(label)}
        </td>

        <td
          style="
            padding:12px;
            border-bottom:1px solid #e2e8f0;
            color:#102a43;
            font-size:13px;
            font-weight:bold;
          "
        >
          ${escapeHtml(value)}
        </td>
      </tr>
    `;
  }

  const content = `
    <div style="text-align:center;">

      <span
        style="
          display:inline-block;
          background-color:#dcfce7;
          color:#166534;
          padding:8px 18px;
          border-radius:24px;
          font-weight:bold;
          font-size:13px;
        "
      >
        Payment Successful
      </span>

      <p style="color:#64748b;margin-bottom:5px;">
        Amount Paid
      </p>

      <h1
        style="
          font-size:36px;
          color:#102a43;
          margin:8px 0 24px;
        "
      >
        ${escapeHtml(formattedAmount)}
      </h1>

      <p>
        Your M-Pesa payment was completed successfully.
        Below are your transaction details.
      </p>
    </div>

    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="
        background:#f8fafc;
        border-collapse:collapse;
        width:100%;
      "
    >

      ${detailRow("Paid To", merchantName)}

      ${detailRow("Transaction ID", transactionId)}

      ${detailRow("Phone Number", maskedPhone)}

      ${detailRow("Date / Time", formattedDate)}

      ${detailRow("Status", "Successful")}

    </table>

    ${emailButton("View Transaction", transactionUrl)}

    <p
      style="
        font-size:12px;
        color:#64748b;
        text-align:center;
      "
    >
      This is an automated receipt from PayLink.
      If you did not make this payment,
      please contact support.
    </p>
  `;

  const text = `
PAYLINK PAYMENT RECEIPT

Payment Successful!

Amount: ${formattedAmount}

Paid To: ${merchantName}
Transaction ID: ${transactionId}
Phone: ${maskedPhone}
Date/Time: ${formattedDate}
Status: Successful

View Transaction:
${transactionUrl}

This is an automated receipt from PayLink.
If you did not make this payment,
please contact support.
  `.trim();

  return {
    html: emailLayout(content),
    text,
  };
}

module.exports = {
  buildPaymentReceiptEmail,
  formatKES,
  maskPhone,
  formatKenyanDate,
};