import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const cards = [
  {
    sku: "CARD-START-001",
    tier: "Free",
    tierColor: "#16A34A",
    name: "NexaStart",
    tagline: "Start your credit journey with no annual fee and real cashback.",
    fee: "€0 / year",
    apr: "—",
    cashback: "1%",
    limit: "Up to €3,000",
    gradient: "linear-gradient(135deg, #14532d 0%, #052e16 100%)",
    popular: false,
    perks: [
      "No annual fee, ever",
      "1% cashback on all purchases",
      "Build your credit history",
      "Spending insights in the app",
      "Apple Pay & Google Pay",
    ],
  },
  {
    sku: "CARD-ESS-001",
    tier: "Essential",
    tierColor: "#2563FF",
    name: "NexaEssential",
    tagline: "Everyday versatility with travel cover and purchase protection.",
    fee: "€49 / year",
    apr: "19.9%",
    cashback: "0.5%",
    limit: "Up to €10,000",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #0B0D12 100%)",
    popular: false,
    perks: [
      "0.5% cashback on all purchases",
      "Basic travel insurance included",
      "Purchase protection up to €1,000",
      "Contactless & virtual card",
      "Fraud monitoring 24/7",
    ],
  },
  {
    sku: "CARD-NOM-001",
    tier: "Travel",
    tierColor: "#0891B2",
    name: "NexaNomad",
    tagline: "No FX fees, lounge access, and full travel cover — made for travellers.",
    fee: "€99 / year",
    apr: "17.9%",
    cashback: "1.5%",
    limit: "Up to €20,000",
    gradient: "linear-gradient(135deg, #164e63 0%, #0B0D12 100%)",
    popular: true,
    perks: [
      "1.5% cashback on all purchases",
      "No foreign transaction fees",
      "2 free airport lounge visits/year",
      "Comprehensive travel & medical insurance",
      "Emergency card replacement worldwide",
    ],
  },
  {
    sku: "CARD-PRES-001",
    tier: "Premium",
    tierColor: "#B45309",
    name: "NexaPrestige",
    tagline: "Our most exclusive card — concierge service, maximum cover, premium perks.",
    fee: "€299 / year",
    apr: "14.9%",
    cashback: "2%",
    limit: "Up to €100,000",
    gradient: "linear-gradient(135deg, #451a03 0%, #0B0D12 100%)",
    popular: false,
    perks: [
      "2% cashback on all purchases",
      "24/7 personal concierge service",
      "Unlimited airport lounge access",
      "Maximum insurance coverage",
      "Dedicated priority support line",
    ],
  },
];

export default function CreditCardsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Cards"] }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Products · Cards</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Credit Cards</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Four cards, one for every stage of life. Earn cashback, travel fee-free, and pay with confidence.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["4", "Cards to choose from"],
              ["Up to 2%", "Cashback rate"],
              ["€0", "Entry annual fee"],
              ["14.9%", "Lowest APR"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section id="dy-credit-cards-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.sku}
              className="bg-white rounded-3xl border border-[#D8E0ED] p-6 flex flex-col relative"
              style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
            >
              {card.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2563FF] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                  Most Popular
                </div>
              )}

              {/* Card visual */}
              <div
                className="rounded-2xl h-40 mb-5 relative overflow-hidden flex-shrink-0"
                style={{ background: card.gradient }}
              >
                <div
                  className="absolute top-4 left-4 w-8 h-6 rounded"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm tracking-wide">{card.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>NexaBank</p>
                </div>
                <div className="absolute bottom-4 right-4 flex">
                  <div className="w-5 h-5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                  <div className="w-5 h-5 rounded-full -ml-2" style={{ background: "rgba(255,255,255,0.12)" }} />
                </div>
              </div>

              {/* Tier badge */}
              <span
                className="self-start text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
                style={{ color: card.tierColor, backgroundColor: `${card.tierColor}18` }}
              >
                {card.tier}
              </span>

              <h3 className="font-bold text-[#0B0D12] text-xl mb-2" style={{ letterSpacing: "-0.01em" }}>
                {card.name}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">{card.tagline}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  ["Fee", card.fee.split(" ")[0]],
                  ["APR", card.apr],
                  ["Cashback", card.cashback],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#F6F7FB] rounded-xl p-2.5 text-center">
                    <p className="text-[#6B7280] text-xs mb-0.5">{label}</p>
                    <p className="font-bold text-[#0B0D12] text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Perks */}
              <ul className="space-y-2 mb-6 text-sm">
                {card.perks.map((p) => (
                  <li key={p} className="flex gap-2 items-start">
                    <span className="font-bold mt-0.5 shrink-0" style={{ color: card.tierColor }}>✓</span>
                    <span className="text-[#6B7280]">{p}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/signup?product=${card.sku}`}
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
