import { useState } from "react";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Eye,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Menu,
  Receipt,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

// Email types displayed in the dashboard.
const EMAIL_TYPES = {
  welcome: {
    label: "Welcome Email",
    description: "Onboard a new PayLink merchant.",
    icon: Mail,
    endpoint: "/api/register",
  },
  receipt: {
    label: "Payment Receipt",
    description: "Send a branded M-Pesa payment receipt.",
    icon: Receipt,
    endpoint: "/api/test/payment-receipt",
  },
  reset: {
    label: "Password Reset",
    description: "Send an account recovery email.",
    icon: LockKeyhole,
    endpoint: "/api/test/password-reset",
  },
};

// Initial values shown in the live preview.
const INITIAL_FORMS = {
  welcome: {
    name: "Wanjiku Kamau",
    email: "",
  },

  receipt: {
    email: "",
    amount: "2500",
    phone: "0712345678",
    merchantName: "Nairobi Electronics",
  },

  reset: {
    name: "Wanjiku Kamau",
    email: "",
  },
};

// Format KES amounts.
function formatMoney(value) {
  return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
}

// Dashboard stat card.
function StatCard({ icon: Icon, title, value, hint }) {
  return (
    <div className="panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">
          {title}
        </span>

        <div className="rounded-xl bg-emerald-400/10 p-2.5">
          <Icon
            size={18}
            className="text-emerald-400"
          />
        </div>
      </div>

      <p className="text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {hint}
      </p>
    </div>
  );
}

// Reusable form input.
function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
}) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
      </span>

      <input
        className="field"
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) =>
          onChange(name, event.target.value)
        }
      />
    </label>
  );
}

// Branded preview of welcome, receipt or reset email.
function EmailPreview({ type, data }) {
  const firstName =
    data.name?.trim().split(/\s+/)[0] || "Friend";

  const maskedPhone =
    data.phone?.replace(/\D/g, "").slice(-4) || "5678";

  return (
    <div className="overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl">
      {/* Shared PayLink email header */}
      <div className="bg-[#102a43] px-6 py-9 text-center">
        <div className="text-3xl font-black tracking-tight text-white">
          PayLink
          <span className="text-emerald-400">.</span>
        </div>

        <p className="mt-2 text-xs tracking-wide text-slate-300">
          Simple, Secure M-Pesa Payments
        </p>
      </div>

      <div className="px-6 py-8 sm:px-8">
        {type === "welcome" && (
          <div>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              WELCOME ABOARD
            </span>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Welcome, {firstName}!
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your PayLink account is ready.
              Start accepting M-Pesa payments
              with a simpler payment experience.
            </p>

            <div className="my-6 rounded-xl bg-slate-50 p-5">
              <p className="mb-4 text-sm font-bold text-slate-900">
                Your journey starts here
              </p>

              {[
                "Log in to your dashboard",
                "Create your first payment link",
                "Share it with your customer",
                "Get paid via M-Pesa",
              ].map((step, index) => (
                <div
                  key={step}
                  className="mb-3 flex items-center gap-3 last:mb-0"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {index + 1}
                  </span>

                  <span className="text-xs text-slate-600">
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-emerald-600 px-5 py-3.5 text-center text-sm font-semibold text-white">
              Go to Dashboard
            </div>
          </div>
        )}

        {type === "receipt" && (
          <div className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2
                size={30}
                className="text-emerald-600"
              />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-700">
              Payment Successful
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {formatMoney(data.amount)}
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Your M-Pesa payment has been completed.
            </p>

            <div className="my-7 space-y-4 rounded-xl bg-slate-50 p-5 text-left">
              {[
                ["Paid to", data.merchantName],
                ["Transaction ID", "TXN-PREVIEW"],
                ["Phone", `******${maskedPhone}`],
                ["Status", "Successful"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="text-xs text-slate-500">
                    {label}
                  </span>

                  <span className="text-right text-xs font-semibold text-slate-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white">
              View Transaction
            </div>
          </div>
        )}

        {type === "reset" && (
          <div>
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-blue-50">
              <LockKeyhole
                size={28}
                className="text-blue-600"
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Reset your password
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Hello {firstName}, we received a request
              to reset your PayLink password.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use the button below to create a new
              password for your account.
            </p>

            <div className="mt-7 rounded-xl bg-blue-600 px-5 py-3.5 text-center text-sm font-semibold text-white">
              Reset Password
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-xs text-amber-800">
              <Clock3 size={16} />
              This link expires in 1 hour.
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              If you did not request this password reset,
              you can safely ignore this email.
            </p>
          </div>
        )}
      </div>

      {/* Shared preview footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center">
        <p className="text-xs text-slate-500">
          © 2026 PayLink. All rights reserved.
        </p>

        <p className="mt-3 text-xs text-emerald-700">
          Support · Twitter · LinkedIn · GitHub
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeType, setActiveType] = useState("welcome");
  const [forms, setForms] = useState(INITIAL_FORMS);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [history, setHistory] = useState([]);

  const [mobilePreview, setMobilePreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentForm = forms[activeType];
  const currentType = EMAIL_TYPES[activeType];

  // Update the selected form independently.
  function updateField(name, value) {
    setForms((previous) => ({
      ...previous,
      [activeType]: {
        ...previous[activeType],
        [name]: value,
      },
    }));
  }

  // Call the real Express backend.
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setNotification(null);

    try {
      const response = await fetch(currentType.endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...currentForm,
          ...(activeType === "receipt"
            ? { amount: Number(currentForm.amount) }
            : {}),
        }),
      });

      // The proxy returns non-JSON when the backend is down.
      const result = await response.json().catch(() => ({}));

      if (!response.ok && !result.message && response.status >= 500) {
        throw new Error(
          "Cannot reach the backend. Is it running on port 3001?"
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Email request failed"
        );
      }

      const item = {
        id: crypto.randomUUID(),
        type: currentType.label,
        email: currentForm.email,
        time: new Date().toLocaleTimeString(),
        status:
          activeType === "welcome"
            ? "Queued"
            : "Accepted",
      };

      setHistory((previous) => [item, ...previous]);

      setNotification({
        type: "success",
        text:
          activeType === "welcome"
            ? "Welcome request accepted. Check server logs for email status."
            : "Email accepted by Resend. Check your inbox.",
      });

    } catch (error) {
      setNotification({
        type: "error",
        text: error.message,
      });

    } finally {
      setLoading(false);
    }
  }

  // Only local session activity; not provider-wide analytics.
  const totalRequests = history.length;
  const acceptedRequests =
    history.filter((item) => item.status === "Accepted").length;

  return (
    <div className="dashboard-glow min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1700px]">

        {/* Navigation sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64
            border-r border-white/10 bg-[#0c1b2b]
            p-6 transition-transform duration-300
            lg:static lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400 p-2.5">
                <Send
                  size={20}
                  className="text-emerald-950"
                />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  PayLink
                  <span className="text-emerald-400">
                    .
                  </span>
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Studio
                </p>
              </div>
            </div>

            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </div>

          <div className="mb-9 flex items-center gap-3 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            <LayoutDashboard size={18} />
            Email Dashboard
          </div>

          <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Templates
          </div>

          <nav className="space-y-2">
            {Object.entries(EMAIL_TYPES).map(([key, item]) => {
              const Icon = item.icon;
              const active = activeType === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveType(key);
                    setSidebarOpen(false);
                    setNotification(null);
                  }}
                  className={`
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3 text-left
                    text-sm transition
                    ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={
                      active ? "text-emerald-400" : ""
                    }
                  />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {active && (
                    <ChevronRight size={15} />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-14 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
            <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-emerald-400/10">
              <ShieldCheck
                size={19}
                className="text-emerald-400"
              />
            </div>

            <p className="text-sm font-semibold text-white">
              Built for secure payments
            </p>

            <p className="mt-2 text-xs leading-6 text-slate-400">
              Transactional messaging for the
              PayLink M-Pesa platform.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
          <header className="mb-9 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-white/10 p-2 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs text-slate-500">
                  Workspace / Communications
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-200">
                  Overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-400/10 px-3 py-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                Local testing
              </span>
            </div>
          </header>

          {/* Hero section */}
          <section className="relative mb-8 overflow-hidden rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-[#173d46] via-[#102a3b] to-[#102033] p-7 sm:p-9">
            <div className="absolute -right-12 -top-16 size-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles size={13} />
                Communication made effortless
              </div>

              <h1 className="gradient-text text-3xl font-bold leading-tight sm:text-4xl">
                Every payment deserves
                a great experience.
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Create, preview and send beautiful,
                personalised transactional emails
                powered by Resend.
              </p>
            </div>
          </section>

          {/* Dashboard stats */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={Mail}
              title="Email Requests"
              value={totalRequests}
              hint="This browser session"
            />

            <StatCard
              icon={CheckCircle2}
              title="Accepted by API"
              value={acceptedRequests}
              hint="Excludes queued welcome emails"
            />

            <StatCard
              icon={Zap}
              title="Email Templates"
              value="03"
              hint="Ready to personalise"
            />
          </section>

          {/* Builder title */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Email Builder
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Customise your message and preview
                its design.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Left: Email form */}
            <section className="panel animate-rise overflow-hidden">
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-400/10 p-3">
                    <currentType.icon
                      size={20}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {currentType.label}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {currentType.description}
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
              >
                {activeType !== "receipt" && (
                  <FormField
                    label="Full Name"
                    name="name"
                    value={currentForm.name}
                    onChange={updateField}
                    placeholder="Wanjiku Kamau"
                  />
                )}

                <FormField
                  label="Recipient Email Address"
                  name="email"
                  type="email"
                  value={currentForm.email}
                  onChange={updateField}
                  placeholder="your-email@gmail.com"
                />

                {activeType === "receipt" && (
                  <>
                    <FormField
                      label="Amount (KES)"
                      name="amount"
                      type="number"
                      value={currentForm.amount}
                      onChange={updateField}
                      placeholder="2500"
                    />

                    <FormField
                      label="M-Pesa Phone Number"
                      name="phone"
                      value={currentForm.phone}
                      onChange={updateField}
                      placeholder="0712345678"
                    />

                    <FormField
                      label="Merchant Name"
                      name="merchantName"
                      value={currentForm.merchantName}
                      onChange={updateField}
                      placeholder="Nairobi Electronics"
                    />
                  </>
                )}

                {activeType === "reset" && (
                  <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <CircleHelp
                      size={18}
                      className="shrink-0 text-amber-400"
                    />

                    <p className="text-xs leading-6 text-amber-200">
                      This assignment endpoint sends
                      a demonstration reset link.
                      Real password changes are not
                      implemented.
                    </p>
                  </div>
                )}

                {notification && (
                  <div
                    role="status"
                    className={`
                      rounded-xl border p-4 text-sm
                      ${
                        notification.type === "success"
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                          : "border-red-400/20 bg-red-400/10 text-red-200"
                      }
                    `}
                  >
                    {notification.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-5 py-4 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Activity
                        size={18}
                        className="animate-pulse"
                      />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send {currentType.label}
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck size={14} />
                  Powered by Resend API
                </div>
              </form>
            </section>

            {/* Right: Live email preview */}
            <section className="panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Eye
                      size={18}
                      className="text-emerald-400"
                    />

                    <h3 className="font-semibold text-white">
                      Live Preview
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Illustrative email design
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobilePreview(!mobilePreview)
                  }
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5"
                >
                  {mobilePreview ? (
                    <LayoutDashboard size={14} />
                  ) : (
                    <Smartphone size={14} />
                  )}

                  {mobilePreview ? "Desktop" : "Mobile"}
                </button>
              </div>

              <div className="bg-[#13273b] p-4 sm:p-7">
                <div
                  className={`
                    mx-auto transition-all duration-300
                    ${
                      mobilePreview
                        ? "max-w-[320px]"
                        : "max-w-[520px]"
                    }
                  `}
                >
                  <EmailPreview
                    type={activeType}
                    data={currentForm}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Recent activity */}
          <section className="panel mt-8 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/10 p-6">
              <Activity
                size={19}
                className="text-emerald-400"
              />

              <div>
                <h3 className="font-semibold text-white">
                  Recent Activity
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Requests made in this browser session
                </p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <div className="mb-4 rounded-2xl bg-white/5 p-4">
                  <Mail
                    size={25}
                    className="text-slate-400"
                  />
                </div>

                <p className="text-sm font-semibold text-white">
                  No email requests yet
                </p>

                <p className="mt-2 max-w-xs text-xs leading-6 text-slate-500">
                  Send your first test email and
                  it will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-emerald-400/10 p-3">
                        <Mail
                          size={17}
                          className="text-emerald-400"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.type}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {item.email}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-emerald-400">
                        {item.status}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
            <p>© 2026 PayLink Studio</p>

            <p>
              Crafted for modern African payments.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}