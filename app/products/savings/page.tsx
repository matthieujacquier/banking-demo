import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const accounts = [
  {
    sku: "SAV-INST-001",
    slug: "instant-access",
    category: "Instant Access",
    accent: "#16A34A",
    name: "Instant Access Savings",
    description: "Earn interest from day one with no restrictions on withdrawals. Your money is always available when you need it.",
    badge: "No notice period",
    rate: "3.5% AER",
    minDeposit: "€0",
    access: "Instant withdrawal",
    maxDeposit: "Up to €250,000",
    perks: [
      "No minimum deposit to open",
      "Withdraw anytime, no penalty",
      "Interest paid monthly",
      "Manage entirely in the app",
      "FSCS protected up to €100,000",
    ],
  },
  {
    sku: "SAV-NOT-001",
    slug: "notice-account",
    category: "Notice Account",
    accent: "#0891B2",
    name: "Notice Account",
    description: "Commit to a 30 or 90-day notice period and earn a higher rate. Ideal if you rarely need instant access.",
    badge: "Higher rate",
    rate: "4.1% AER",
    minDeposit: "€1,000",
    access: "30 or 90-day notice",
    maxDeposit: "Up to €500,000",
    perks: [
      "Choice of 30 or 90-day notice period",
      "Higher rate than instant access",
      "No upper age limit",
      "Interest paid quarterly",
      "FSCS protected up to €100,000",
    ],
  },
  {
    sku: "SAV-TERM-001",
    slug: "term-deposit",
    category: "Term Deposit",
    accent: "#2563FF",
    name: "Term Deposit",
    description: "Lock in a guaranteed rate for 6, 12 or 24 months. No market risk — ideal for medium-term goals.",
    badge: "Guaranteed return",
    rate: "4.8% AER",
    minDeposit: "€1,000",
    access: "Fixed term (6–24 months)",
    maxDeposit: "Up to €1,000,000",
    perks: [
      "Fixed rate locked in at opening",
      "Choose 6, 12 or 24-month term",
      "Interest paid at maturity",
      "Auto-renewal option available",
      "FSCS protected up to €100,000",
    ],
  },
  {
    sku: "SAV-REG-001",
    slug: "regulated-savings",
    category: "Regulated",
    accent: "#7C3AED",
    name: "Regulated Savings Account",
    description: "A government-backed regulated account with tax advantages and full capital protection. Max €22,950.",
    badge: "Tax advantages",
    rate: "3.0% AER",
    minDeposit: "€10",
    access: "Instant withdrawal",
    maxDeposit: "Max €22,950",
    perks: [
      "Interest exempt from income tax",
      "Government-backed capital protection",
      "Minimum opening deposit of just €10",
      "No account management fees",
      "Regulated by national authority",
    ],
  },
  {
    sku: "SAV-PEN-001",
    slug: "pension-savings",
    category: "Pension",
    accent: "#B45309",
    name: "Pension Savings Plan",
    description: "Build your retirement pot with tax relief on contributions and a range of low-cost investment options.",
    badge: "Tax relief",
    rate: "from 3.5% AER",
    minDeposit: "€50/month",
    access: "Retirement age",
    maxDeposit: "No maximum",
    perks: [
      "Tax relief on contributions up to annual limit",
      "Choice of growth or income fund",
      "Employer contribution matching available",
      "Consolidate existing pension pots",
      "Online pension tracker in the app",
    ],
  },
];

export default function SavingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Savings"] }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Products · Savings</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Savings Accounts</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Make your money work harder. From instant access to pension planning — one bank, every savings goal.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["up to 4.8%", "AER interest rate"],
              ["€0", "Minimum deposit"],
              ["5", "Account types"],
              ["Instant", "Access available"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accounts grid */}
      <section id="dy-savings-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div
              key={acc.sku}
              className="bg-white rounded-3xl border border-[#D8E0ED] p-7 flex flex-col"
              style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)", borderTop: `3px solid ${acc.accent}` }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: acc.accent, backgroundColor: `${acc.accent}18` }}
                >
                  {acc.category}
                </span>
                <span className="text-xs font-semibold text-[#6B7280] bg-[#F6F7FB] border border-[#D8E0ED] px-2.5 py-1 rounded-full">
                  {acc.badge}
                </span>
              </div>

              <h3 className="font-bold text-[#0B0D12] text-xl mb-2" style={{ letterSpacing: "-0.01em" }}>
                {acc.name}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">{acc.description}</p>

              <div className="space-y-2.5 text-sm mb-5">
                {[
                  ["Rate", acc.rate],
                  ["Min. deposit", acc.minDeposit],
                  ["Max. deposit", acc.maxDeposit],
                  ["Access", acc.access],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-2.5">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12] text-right">{value}</span>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {acc.perks.slice(0, 3).map((p) => (
                  <li key={p} className="flex gap-2 items-start">
                    <span className="font-bold mt-0.5 shrink-0" style={{ color: acc.accent }}>✓</span>
                    <span className="text-[#6B7280]">{p}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
              >
                Open Account
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
