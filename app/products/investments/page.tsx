import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const products = [
  {
    sku: "INV-FUND-001",
    slug: "managed-funds",
    category: "Funds",
    accent: "#7C3AED",
    name: "Managed Funds",
    description:
      "Actively managed portfolios across equities, bonds and alternatives. Built and rebalanced by our investment team.",
    badge: "Actively managed",
    targetReturn: "5–8% p.a.",
    minInvestment: "€1,000",
    holdingPeriod: "Min. 3 years",
    perks: [
      "Diversified across asset classes and regions",
      "Continuous rebalancing by our investment team",
      "Choice of risk profile from cautious to growth",
      "Detailed monthly performance reports",
      "No exit fees after the first year",
    ],
  },
  {
    sku: "INV-ETF-001",
    slug: "etfs",
    category: "ETFs",
    accent: "#5B21B6",
    name: "ETFs",
    description:
      "Trade hundreds of global ETFs at low cost. Build your own diversified portfolio with full control.",
    badge: "Self-directed",
    targetReturn: "Market-linked",
    minInvestment: "€50",
    holdingPeriod: "No minimum",
    perks: [
      "Access to 500+ global ETFs",
      "Flat €1 commission per trade",
      "Fractional shares from €50",
      "Auto-invest schedules in any ETF",
      "Real-time portfolio analytics in the app",
    ],
  },
  {
    sku: "INV-ROBO-001",
    slug: "robo-advisory",
    category: "Robo",
    accent: "#9333EA",
    name: "Robo-Advisory Portfolio",
    description:
      "Tell us your goal and risk appetite — we build a low-cost, diversified portfolio and rebalance it for you.",
    badge: "Hands-off",
    targetReturn: "4–7% p.a.",
    minInvestment: "€500",
    holdingPeriod: "Min. 5 years",
    perks: [
      "5-minute setup questionnaire",
      "Low all-in fee of 0.45% per year",
      "Automatic rebalancing every quarter",
      "Tax-loss harvesting where available",
      "Top up or withdraw at any time, no penalty",
    ],
  },
  {
    sku: "INV-PEN-001",
    slug: "investment-pension",
    category: "Pension",
    accent: "#6D28D9",
    name: "Investment Pension Plan",
    description:
      "A pension wrapper invested in our managed funds. Tax relief on contributions, projected income at retirement.",
    badge: "Tax relief",
    targetReturn: "5–7% p.a.",
    minInvestment: "€100 / month",
    holdingPeriod: "Retirement age",
    perks: [
      "Tax relief on contributions up to annual limit",
      "Choice of growth, balanced or income fund",
      "Employer matching supported",
      "Retirement income projection updated daily",
      "Consolidate pension pots from previous providers",
    ],
  },
];

export default function InvestmentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Investments"] }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#7C3AED] text-xs font-bold uppercase tracking-widest mb-4">Products · Investments</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Investments</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Grow your wealth on your terms — from beginner-friendly robo portfolios to actively managed funds. Start with any amount.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["from €50", "Minimum investment"],
              ["500+", "ETFs available"],
              ["0.45%", "Lowest annual fee"],
              ["4", "Investment products"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section id="dy-investments-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div
              key={p.sku}
              className="bg-white rounded-3xl border border-[#D8E0ED] p-7 flex flex-col"
              style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)", borderTop: `3px solid ${p.accent}` }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: p.accent, backgroundColor: `${p.accent}18` }}
                >
                  {p.category}
                </span>
                <span className="text-xs font-semibold text-[#6B7280] bg-[#F6F7FB] border border-[#D8E0ED] px-2.5 py-1 rounded-full">
                  {p.badge}
                </span>
              </div>

              <h3 className="font-bold text-[#0B0D12] text-xl mb-2" style={{ letterSpacing: "-0.01em" }}>
                {p.name}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">{p.description}</p>

              <div className="space-y-2.5 text-sm mb-5">
                {[
                  ["Target return", p.targetReturn],
                  ["Min. investment", p.minInvestment],
                  ["Holding period", p.holdingPeriod],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-2.5">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12] text-right">{value}</span>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {p.perks.slice(0, 3).map((perk) => (
                  <li key={perk} className="flex gap-2 items-start">
                    <span className="font-bold mt-0.5 shrink-0" style={{ color: p.accent }}>✓</span>
                    <span className="text-[#6B7280]">{perk}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/products/investments/${p.slug}`}
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
