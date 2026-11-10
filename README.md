# PayLink Studio — Email Integration

### Week 10, Day 3 

A modern, responsive transactional email application built using **React, Tailwind CSS, Node.js, Express, and Resend API**.

PayLink Studio demonstrates how to implement reliable transactional emails in a payment application, including welcome emails, M-Pesa payment receipts, password reset notifications, and reusable email services.

The project includes a modern fintech-inspired dashboard that allows users to customise, preview, and send email templates.

---

## Project Objectives

- Integrate the Resend API to send transactional emails.
- Develop a reusable email service module.
- Build personalised welcome email templates.
- Generate professional M-Pesa payment receipts.
- Implement a demonstration password reset email flow.
- Design responsive HTML email templates.
- Create a modern React frontend styled with Tailwind CSS.
- Provide interactive email previews and form validation.
- Implement error handling and email retry logic.
- Connect the React frontend with the Express backend.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| Tailwind CSS v4 | Responsive UI styling |
| Lucide React | Icons |
| Node.js | Backend runtime |
| Express.js | REST API development |
| Resend API | Transactional email delivery |
| dotenv | Environment configuration |
| CORS | Cross-origin request handling |
| JavaScript | Application logic |
| HTML & Inline CSS | Email templates |

## Key Features

### 1. Welcome Email

- Personalised customer greeting.
- Branded PayLink email header and footer.
- Four-step onboarding instructions.
- Dashboard call-to-action button.
- HTML and plain-text email versions.
- Asynchronous email sending.

### 2. M-Pesa Payment Receipt

- Payment successful confirmation.
- Amount formatted in Kenyan shillings (KES).
- Merchant and transaction information.
- Masked customer phone number.
- Date and time formatted for Nairobi.
- Transaction details and CTA button.
- HTML and plain-text email versions.

### 3. Password Reset Email

- Personalised account recovery message.
- Secure random token generation for demonstration.
- Password reset button and fallback URL.
- One-hour expiry notice in the email.
- HTML and plain-text email versions.

**Note:** The password reset feature is for demonstration only. It does not implement database-backed token storage, expiration enforcement, or password updates.

### 4. Reusable Email Service

- Centralised Resend API integration.
- Reusable `sendEmail()` function.
- Dedicated functions for each email type.
- Error handling and logging.
- One automatic retry after a one-second delay.
- Resend email ID logging.

### 5. React & Tailwind Dashboard

- Responsive fintech-inspired dashboard.
- Dark navy and emerald colour theme.
- Email template selection.
- Interactive email forms.
- Live email previews.
- Desktop and mobile preview modes.
- Email request activity history.
- Loading states and success/error notifications.
- Integration with the Express backend.

---

## Project Structure

```text
week-10-day-3-assignment/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── emails/
│   ├── layout.js
│   ├── welcomeEmail.js
│   ├── paymentReceipt.js
│   └── passwordReset.js
│
├── services/
│   └── emailService.js
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Dominic-kores/week-10-day-3-email-integration

cd week-10-day-3-assignment
```

Replace the repository URL if your actual repository has a different name.

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
RESEND_API_KEY=re_your_actual_api_key
FROM_EMAIL="PayLink <onboarding@resend.dev>"
PORT=3001
APP_URL=https://paylink.example.com
SUPPORT_EMAIL=support@example.com
ENABLE_TEST_ENDPOINTS=true
```

The Resend testing sender has recipient restrictions. Verify your own domain to send emails to general recipients.

Never commit your `.env` file to GitHub.

### 4. Install Frontend Dependencies

Open a second terminal:

```bash
cd client
npm install
```

### 5. Start the Backend

From the project root:

```bash
npm run dev
```

Backend URL:

`http://localhost:3001`

### 6. Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173`

The Vite development proxy forwards `/api` requests to the Express backend.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health check |
| POST | `/api/register` | Send welcome email |
| POST | `/api/test/payment-receipt` | Send payment receipt |
| POST | `/api/test/password-reset` | Send password reset email |

### Welcome Email Request

```json
{
  "name": "Wanjiku Kamau",
  "email": "your-email@gmail.com"
}
```

Expected HTTP status: `201 Created`.

### Payment Receipt Request

```json
{
  "email": "your-email@gmail.com",
  "amount": 2500,
  "phone": "0712345678",
  "merchantName": "Nairobi Electronics"
}
```

Expected HTTP status: `200 OK` when Resend accepts the email request.

### Password Reset Request

```json
{
  "name": "Wanjiku Kamau",
  "email": "your-email@gmail.com"
}
```

Expected HTTP status: `200 OK` when Resend accepts the email request.

**Note:** Welcome email sending is asynchronous. A successful registration response does not guarantee email delivery.

---

## Frontend and Backend Integration

The React frontend communicates with the Express backend through the Fetch API.

**Example:**

```javascript
const response = await fetch("/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Wanjiku Kamau",
    email: "your-email@gmail.com",
  }),
});

const data = await response.json();
```

The backend then uses the reusable email service to build the appropriate template and submit the email to Resend.

**Application Flow:**

```text
React + Tailwind CSS Dashboard
             |
             v
      Express REST API
             |
             v
     Email Service Module
             |
             v
       HTML Email Builder
             |
             v
          Resend API
             |
             v
       Recipient Inbox
```


---

## Security Considerations

- Sensitive API credentials are stored in environment variables.
- `.env` and `node_modules` are excluded from Git.
- Resend credentials remain on the backend.
- Email templates escape dynamic HTML values.
- Payment receipt templates mask customer phone numbers.
- Password reset tokens are generated using Node.js `crypto`.
- API endpoints validate incoming request data.
- Demonstration email endpoints must be disabled or properly protected in production.

**Production limitations:** The current application does not include database persistence, user authentication, real password reset processing, email delivery tracking, or verified M-Pesa callback handling. These features must be added before using the system for actual customer payments.

## Future Improvements

- Integrate the email service into PayLink v2.
- Send receipts automatically after verified M-Pesa payments.
- Store customer records and email history in PostgreSQL.
- Implement full password reset functionality.
- Add user authentication and role-based access control.
- Implement background email processing with queues.
- Track delivery status through Resend webhooks.
- Deploy the frontend to Vercel and backend to Railway.
- Add automated tests and CI/CD workflows.

---

## Live Project

**GitHub Repository:** https://dominic-kores.github.io/week-10-day-3-email-integration/




---
## Author

**Dominic Kores**

Full-Stack Software & AI Engineer

