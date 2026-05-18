import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const products = [
  {
    sku: "CASH-CARD-001",
    slug: "cashback-card",
    category: "Cashback Card",
    accent: "#EC4899",
    name: "Cashback Credit Card",
    description:
      "A dedicated cashback credit card with elevated rewards on groceries, fuel and online subscriptions.",
    badge: "Flagship",
    cashbackRate: "up to 3%",
    monthlyCap: "€150",
    fee: "€59 / year",
    perks: [
      "3% cashback on groceries and fuel",
      "1.5% cashback on online subscriptions",
      "1% cashback on everything else",
      "Cashback credited as statement credit monthly",
      "Apple Pay and Google Pay supported",
    ],
  },
  {
    sku: "CASH-REW-001",
    slug: "rewards-programme",
    category: "Rewards",
    accent: "#DB2777",
    name: "Cashback Rewards Programme",
    description:
      "Earn cashback on top of your card cashback by shopping with NexaBank partner brands. Free to join.",
    badge: "Partner brands",
    cashbackRate: "up to 10%",
    monthlyCap: "No cap",
    fee: "€0",
    perks: [
      "Earn 2–10% extra at 300+ partner brands",
      "Stacks on top of card cashback",
      "Activate offers in one tap in the app",
      "Rewards credited within 48 hours of purchase",
      "Free for all NexaBank customers",
    ],
  },
];

export default function CashbackPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Cashback"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#EC4899] text-xs font-bold uppercase tracking-widest mb-4">Products · Cashback</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Cashback</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Turn everyday spending into rewards. Automatic cashback on every card, plus exclusive partner offers stacked on top.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["up to 10%", "Partner cashback"],
              ["300+", "Partner brands"],
              ["€0", "Programme cost"],
              ["48h", "Reward credit time"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dy-cashback-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
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
                  ["Cashback rate", p.cashbackRate],
                  ["Monthly cap", p.monthlyCap],
                  ["Fee", p.fee],
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
                href={`/products/cashback/${p.slug}`}
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
