import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  "instant-access": {
    sku: "SAV-INST-001",
    category: "Instant Access",
    accent: "#16A34A",
    name: "Instant Access Savings",
    tagline: "Earn interest from day one with no restrictions on withdrawals.",
    rate: "3.5% AER (variable)",
    minDeposit: "€0",
    access: "Instant withdrawal",
    description:
      "Instant Access Savings is the simplest way to start earning a competitive rate on cash you want to keep available. There's no minimum opening deposit, no notice period and no penalty for withdrawing — interest accrues daily and is paid monthly straight into your account.",
    features: [
      "No minimum deposit to open the account",
      "Withdraw anytime with no penalty",
      "Interest accrues daily, paid monthly",
      "Manage entirely from the NexaBank app",
      "FSCS-equivalent protection up to €100,000",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Valid government-issued ID",
      "Tax residency declared at account opening",
    ],
  },
  "notice-account": {
    sku: "SAV-NOT-001",
    category: "Notice Account",
    accent: "#0891B2",
    name: "Notice Account",
    tagline: "Commit to a short notice period and earn a higher rate on your savings.",
    rate: "4.1% AER (variable)",
    minDeposit: "€1,000",
    access: "30 or 90-day notice",
    description:
      "The Notice Account rewards you for planning your withdrawals ahead. Choose between a 30 or 90-day notice period and earn a meaningfully higher rate than Instant Access. Ideal if you rarely need cash on short notice but want better returns than a standard savings account.",
    features: [
      "Choice of 30 or 90-day notice period",
      "Higher rate than Instant Access",
      "No upper age limit",
      "Interest paid quarterly",
      "FSCS-equivalent protection up to €100,000",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Minimum opening deposit of €1,000",
      "Active NexaBank current account",
      "Tax residency declared at account opening",
    ],
  },
  "term-deposit": {
    sku: "SAV-TERM-001",
    category: "Term Deposit",
    accent: "#2563FF",
    name: "Term Deposit",
    tagline: "Lock in a guaranteed rate for 6, 12 or 24 months — no market risk.",
    rate: "up to 4.8% AER",
    minDeposit: "€1,000",
    access: "Fixed term (6–24 months)",
    description:
      "A Term Deposit is the right choice when you have a known time horizon and want a guaranteed return. Lock in a fixed rate at the moment you open the account; your interest is paid at maturity and the rate is unaffected by market movements during the term. Choose 6, 12 or 24 months.",
    features: [
      "Fixed rate locked in at the moment of opening",
      "Choice of 6, 12 or 24-month term",
      "Interest paid at maturity",
      "Optional auto-renewal at the prevailing rate",
      "FSCS-equivalent protection up to €100,000",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Minimum opening deposit of €1,000",
      "Active NexaBank current account",
      "Tax residency declared at account opening",
    ],
  },
  "regulated-savings": {
    sku: "SAV-REG-001",
    category: "Regulated",
    accent: "#7C3AED",
    name: "Regulated Savings Account",
    tagline: "A government-backed regulated account with tax advantages and full capital protection.",
    rate: "3.0% AER (variable)",
    minDeposit: "€10",
    access: "Instant withdrawal",
    description:
      "Regulated Savings combines instant access with the tax efficiency of a government-backed scheme. Interest is exempt from income tax up to the regulatory cap, capital is fully protected, and the minimum opening deposit is just €10 — making it the most accessible tax-advantaged account in our range.",
    features: [
      "Interest exempt from income tax (within regulatory limits)",
      "Government-backed capital protection",
      "Minimum opening deposit of just €10",
      "No account management fees",
      "Regulated by the national financial authority",
    ],
    eligibility: [
      "Aged 18 or over and resident in the eligible jurisdiction",
      "Maximum balance capped at €22,950 per holder",
      "Active NexaBank current account",
      "Tax residency declared at account opening",
    ],
  },
  "pension-savings": {
    sku: "SAV-PEN-001",
    category: "Pension",
    accent: "#B45309",
    name: "Pension Savings Plan",
    tagline: "Build your retirement pot with tax relief and a range of low-cost funds.",
    rate: "from 3.5% AER",
    minDeposit: "€50 / month",
    access: "Retirement age",
    description:
      "The Pension Savings Plan is a long-term wrapper for retirement. Contributions qualify for tax relief up to the annual limit, employer matching is supported, and you can consolidate existing pension pots from previous providers. Pick a growth fund or a steady income fund — switch any time inside the app.",
    features: [
      "Tax relief on contributions up to annual limit",
      "Choice of growth or income fund",
      "Employer contribution matching supported",
      "Consolidate pension pots from previous providers",
      "Online pension tracker and projection tool in the app",
    ],
    eligibility: [
      "Aged 18 or over and resident in the eligible jurisdiction",
      "Active NexaBank current account",
      "Minimum monthly contribution of €50",
      "Tax residency declared at account opening",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function SavingsProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS[slug as keyof typeof PRODUCTS];
  if (!product) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "PRODUCT", data: [product.sku] }} />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0B0D12] text-white py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 25% 50%, ${product.accent}22 0%, #0B0D12 62%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/products/savings" className="text-white/70 hover:text-white transition-colors">
              Savings
            </Link>
            <span className="text-white/70">›</span>
            <span className="text-white">{product.name}</span>
          </div>
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-5"
            style={{ color: product.accent, backgroundColor: `${product.accent}25` }}
          >
            {product.category}
          </span>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>
            {product.name}
          </h1>
          <p className="text-white/85 text-lg max-w-xl">{product.tagline}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.01em" }}>
                About this account
              </h2>
              <p className="text-[#6B7280] leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-5" style={{ letterSpacing: "-0.01em" }}>
                Key features
              </h2>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 items-start">
                    <span className="font-bold mt-0.5" style={{ color: product.accent }}>✓</span>
                    <span className="text-[#1F2937] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-5" style={{ letterSpacing: "-0.01em" }}>
                Eligibility
              </h2>
              <ul className="space-y-3">
                {product.eligibility.map((e) => (
                  <li key={e} className="flex gap-3 items-start">
                    <span className="text-[#6B7280] mt-0.5">—</span>
                    <span className="text-[#1F2937] text-sm">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-7 sticky top-20" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Account summary</p>
              <div className="space-y-3 mb-7">
                {[
                  ["Rate", product.rate],
                  ["Min. deposit", product.minDeposit],
                  ["Access", product.access],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-3 text-sm">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12] text-right">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/login"
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mb-3"
              >
                Open Account
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                AER (Annual Equivalent Rate) shown. Rates may vary; check Terms before opening.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
