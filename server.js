// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("node:crypto");

const {
  sendWelcomeEmail,
  sendPaymentReceipt,
  sendPasswordReset,
} = require("./services/emailService");

// Initialise Express.
const app = express();

const PORT = process.env.PORT || 3001;

// Middleware.
app.use(cors());
app.use(express.json({ limit: "20kb" }));

// Simple email validation.
function isValidEmail(email) {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

// Check that incoming text is nonempty.
function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

// Health check.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PayLink Email Integration API is running",
    endpoints: [
      "POST /api/register",
      "POST /api/test/payment-receipt",
      "POST /api/test/password-reset",
    ],
  });
});

// -------------------------------------------------
// TASK 1: Welcome Email
// POST /api/register
// -------------------------------------------------

app.post("/api/register", (req, res) => {
  const { name, email } = req.body || {};

  // Validate incoming data.
  if (!isNonEmptyString(name) || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid name and email are required",
    });
  }

  const user = {
    name: name.trim(),
    email: email.trim(),
  };

  // Send asynchronously, as requested by the assignment.
  // Do not block the HTTP response while sending.
  sendWelcomeEmail(user).catch((error) => {
    console.error(
      "Welcome email delivery failed:",
      error.message
    );
  });

  // Assignment-compatible response.
  // This is a demo registration; no database is used.
  return res.status(201).json({
    success: true,
    message: "Account created. Welcome email sent.",
  });
});

// -------------------------------------------------
// TASK 2: Payment Receipt Email
// POST /api/test/payment-receipt
// -------------------------------------------------

app.post("/api/test/payment-receipt", async (req, res) => {
  const {
    email,
    amount,
    phone,
    merchantName,
  } = req.body || {};

  // Validate payment information.
  if (
    !isValidEmail(email) ||
    !isNonEmptyString(phone) ||
    !isNonEmptyString(merchantName) ||
    !Number.isFinite(Number(amount)) ||
    amount === null ||
    amount === undefined ||
    Number(amount) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Valid email, positive amount, phone and merchantName are required",
    });
  }

  // Generate a unique demonstration transaction ID.
  const transactionId = `TXN${Date.now()}`;

  const transaction = {
    email: email.trim(),
    amount: Number(amount),
    phone: phone.trim(),
    merchantName: merchantName.trim(),
    transactionId,
    paidAt: new Date(),
  };

  try {
    await sendPaymentReceipt(transaction);

    return res.status(200).json({
      success: true,
      transactionId,
      message: "Receipt email sent",
    });

  } catch (error) {
    console.error(
      "Receipt email failed:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message: "Failed to send payment receipt",
    });
  }
});

// -------------------------------------------------
// TASK 3: Password Reset Email
// POST /api/test/password-reset
// -------------------------------------------------

app.post("/api/test/password-reset", async (req, res) => {
  const { name, email } = req.body || {};

  // Validate the request.
  if (!isNonEmptyString(name) || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid name and email are required",
    });
  }

  // Generate a random 32-byte token.
  // This is a demonstration token only.
  const token = crypto.randomBytes(32).toString("hex");

  const user = {
    name: name.trim(),
    email: email.trim(),
  };

  try {
    await sendPasswordReset(user, token);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });

  } catch (error) {
    console.error(
      "Password reset email failed:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message: "Failed to send password reset email",
    });
  }
});

// -------------------------------------------------
// Unknown routes.
// -------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// -------------------------------------------------
// Global error handler.
// -------------------------------------------------

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// -------------------------------------------------
// Start server.
// -------------------------------------------------

app.listen(PORT, "127.0.0.1", () => {
  console.log(`PayLink API: http://127.0.0.1:${PORT}`);
});