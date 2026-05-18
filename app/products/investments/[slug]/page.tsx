import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  "managed-funds": {
    sku: "INV-FUND-001",
    category: "Funds",
    accent: "#7C3AED",
    name: "Managed Funds",
    tagline: "Actively managed portfolios across equities, bonds and alternatives.",
    targetReturn: "5–8% p.a. (target)",
    minInvestment: "€1,000",
    holdingPeriod: "Min. 3 years",
    description:
      "Our Managed Funds are built and continuously rebalanced by our in-house investment team. Choose a risk profile from cautious to growth, and we diversify across asset classes, regions and currencies on your behalf. Monthly performance reports give you full transparency on holdings and trades.",
    features: [
      "Diversified across asset classes and regions",
      "Continuous rebalancing by our investment team",
      "Choice of risk profile from cautious to growth",
      "Detailed monthly performance reports",
      "No exit fees after the first year",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Minimum investment of €1,000",
      "Suitability questionnaire completed at onboarding",
    ],
  },
  etfs: {
    sku: "INV-ETF-001",
    category: "ETFs",
    accent: "#5B21B6",
    name: "ETFs",
    tagline: "Trade hundreds of global ETFs at low cost — build your own portfolio.",
    targetReturn: "Market-linked",
    minInvestment: "€50",
    holdingPeriod: "No minimum",
    description:
      "Take full control of your portfolio with access to over 500 ETFs across global markets. Flat €1 commission per trade, fractional shares from €50 and auto-invest schedules let you build a diversified portfolio at any budget. Real-time analytics inside the app show allocation, performance and dividends.",
    features: [
      "Access to 500+ global ETFs",
      "Flat €1 commission per trade",
      "Fractional shares from €50",
      "Auto-invest schedules in any ETF",
      "Real-time portfolio analytics in the app",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Minimum investment of €50",
      "Suitability questionnaire completed at onboarding",
    ],
  },
  "robo-advisory": {
    sku: "INV-ROBO-001",
    category: "Robo",
    accent: "#9333EA",
    name: "Robo-Advisory Portfolio",
    tagline: "Tell us your goal — we build the portfolio and rebalance it for you.",
    targetReturn: "4–7% p.a. (target)",
    minInvestment: "€500",
    holdingPeriod: "Min. 5 years",
    description:
      "The Robo-Advisory Portfolio is the easiest way to start investing. A 5-minute questionnaire matches you to a risk profile, and we invest your money in a globally diversified portfolio of low-cost funds. We rebalance every quarter and harvest tax losses where local rules allow, all for a single 0.45% annual fee.",
    features: [
      "5-minute setup questionnaire",
      "Low all-in fee of 0.45% per year",
      "Automatic rebalancing every quarter",
      "Tax-loss harvesting where available",
      "Top up or withdraw at any time, no penalty",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Minimum investment of €500",
      "Suitability questionnaire completed at onboarding",
    ],
  },
  "investment-pension": {
    sku: "INV-PEN-001",
    category: "Pension",
    accent: "#6D28D9",
    name: "Investment Pension Plan",
    tagline: "A pension wrapper invested in our managed funds with tax relief on contributions.",
    targetReturn: "5–7% p.a. (target)",
    minInvestment: "€100 / month",
    holdingPeriod: "Retirement age",
    description:
      "The Investment Pension Plan combines the long-term growth of our Managed Funds with the tax efficiency of a pension wrapper. Contributions qualify for tax relief up to the annual limit, employer matching is supported, and a retirement income projection updates daily as markets move and you contribute.",
    features: [
      "Tax relief on contributions up to annual limit",
      "Choice of growth, balanced or income fund",
      "Employer contribution matching supported",
      "Retirement income projection updated daily",
      "Consolidate pension pots from previous providers",
    ],
    eligibility: [
      "Aged 18 or over and resident in the eligible jurisdiction",
      "Active NexaBank current account",
      "Minimum monthly contribution of €100",
      "Tax residency declared at account opening",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function InvestmentProductPage({
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

      <section className="relative bg-[#0B0D12] text-white py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 25% 50%, ${product.accent}22 0%, #0B0D12 62%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/products/investments" className="text-white/70 hover:text-white transition-colors">
              Investments
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

      <section className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.01em" }}>
                About this product
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
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Product summary</p>
              <div className="space-y-3 mb-7">
                {[
                  ["Target return", product.targetReturn],
                  ["Min. investment", product.minInvestment],
                  ["Holding period", product.holdingPeriod],
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
                Start Investing
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                Capital at risk. Past performance is not a guide to future returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
