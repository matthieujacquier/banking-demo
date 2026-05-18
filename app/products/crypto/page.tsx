import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const products = [
  {
    sku: "CRYPTO-BTC-001",
    slug: "bitcoin",
    category: "Bitcoin",
    accent: "#F59E0B",
    name: "Bitcoin",
    description:
      "Buy, sell and hold BTC directly from your NexaBank account. Custody is fully insured and segregated.",
    badge: "Most traded",
    spread: "0.7%",
    minTrade: "€10",
    holdings: "Up to €250K",
    perks: [
      "Buy from €10 in one tap",
      "Insured cold-storage custody",
      "Auto-buy schedules (daily/weekly/monthly)",
      "Real-time price alerts",
      "Withdraw to an external wallet anytime",
    ],
  },
  {
    sku: "CRYPTO-ETH-001",
    slug: "ethereum",
    category: "Ethereum",
    accent: "#D97706",
    name: "Ethereum",
    description:
      "Trade ETH and access staking rewards. Custody and execution handled by our regulated partner exchange.",
    badge: "Staking eligible",
    spread: "0.8%",
    minTrade: "€10",
    holdings: "Up to €250K",
    perks: [
      "Buy from €10 in one tap",
      "Earn staking rewards on ETH balances",
      "Insured cold-storage custody",
      "Auto-buy schedules (daily/weekly/monthly)",
      "Withdraw to an external wallet anytime",
    ],
  },
  {
    sku: "CRYPTO-PORT-001",
    slug: "crypto-portfolio",
    category: "Portfolio",
    accent: "#B45309",
    name: "Crypto Portfolio",
    description:
      "A pre-built basket of major cryptocurrencies, rebalanced monthly. Diversified exposure in one product.",
    badge: "Diversified",
    spread: "1.0%",
    minTrade: "€50",
    holdings: "Up to €250K",
    perks: [
      "Pre-built basket of 10 major cryptos",
      "Monthly rebalancing by our partner",
      "All-in 1% annual management fee",
      "Single line in your portfolio view",
      "No need to manage individual coins",
    ],
  },
  {
    sku: "CRYPTO-STAK-001",
    slug: "crypto-staking",
    category: "Staking",
    accent: "#92400E",
    name: "Crypto Staking",
    description:
      "Earn passive rewards by locking eligible crypto assets. Rewards paid in the same asset, weekly.",
    badge: "Passive yield",
    spread: "—",
    minTrade: "€100",
    holdings: "Up to €100K",
    perks: [
      "Earn rewards on ETH, SOL, ADA and more",
      "Rewards paid weekly in the staked asset",
      "Unstake any time (cooldown periods apply)",
      "View projected yield in the app",
      "No third-party validators — handled by our partner",
    ],
  },
];

export default function CryptoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Crypto"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-4">Products · Crypto</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Crypto</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Buy, hold and stake digital assets directly from your NexaBank account, with bank-grade security and fully insured custody.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["from €10", "Minimum trade"],
              ["0.7%", "BTC spread"],
              ["100%", "Insured custody"],
              ["4", "Crypto products"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dy-crypto-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
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
                  ["Spread", p.spread],
                  ["Min. trade", p.minTrade],
                  ["Holdings cap", p.holdings],
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
                href={`/products/crypto/${p.slug}`}
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
