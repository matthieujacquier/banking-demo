import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const products = [
  {
    sku: "INS-LIFE-001",
    slug: "life-insurance",
    category: "Life",
    accent: "#EA580C",
    name: "Life Insurance",
    description:
      "A lump-sum payout to your beneficiaries if the worst happens. Cover from €50,000 to €1,000,000.",
    badge: "Family protection",
    cover: "€50K – €1M",
    premium: "from €8 / month",
    term: "10–30 years",
    perks: [
      "Choice of level or decreasing cover",
      "Optional critical illness rider",
      "No medical exam for cover up to €150,000",
      "Premiums fixed for the full term",
      "Cover for one or two lives",
    ],
  },
  {
    sku: "INS-HOME-001",
    slug: "home-insurance",
    category: "Home",
    accent: "#C2410C",
    name: "Home Insurance",
    description:
      "Buildings and contents cover for owners and renters. Flexible add-ons for accidental damage and valuables.",
    badge: "Owners & renters",
    cover: "up to €1M",
    premium: "from €12 / month",
    term: "12-month renewable",
    perks: [
      "Buildings cover up to €1M",
      "Contents cover up to €100,000",
      "Optional accidental damage cover",
      "Specified valuables add-on",
      "24/7 emergency home assistance",
    ],
  },
  {
    sku: "INS-TRAV-001",
    slug: "travel-insurance",
    category: "Travel",
    accent: "#F97316",
    name: "Travel Insurance",
    description:
      "Single-trip or annual multi-trip cover, including winter sports and high-value gear. Comes free with NexaNomad.",
    badge: "Worldwide",
    cover: "up to €10M medical",
    premium: "from €4 / trip",
    term: "Single or annual",
    perks: [
      "Worldwide medical cover up to €10M",
      "Cancellation and curtailment cover",
      "Lost or delayed baggage protection",
      "Optional winter sports cover",
      "Free with NexaNomad credit card",
    ],
  },
  {
    sku: "INS-INC-001",
    slug: "income-protection",
    category: "Income",
    accent: "#9A3412",
    name: "Income Protection",
    description:
      "Replaces a portion of your income if you cannot work due to illness or injury. Tax-free monthly payouts.",
    badge: "Self-employed friendly",
    cover: "up to 70% of income",
    premium: "from €15 / month",
    term: "To retirement age",
    perks: [
      "Tax-free monthly payouts",
      "Cover up to 70% of pre-tax income",
      "Available to employed and self-employed",
      "Choice of deferred periods from 4 to 52 weeks",
      "Optional inflation-linking on benefit amount",
    ],
  },
];

export default function InsurancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Insurance"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#EA580C] text-xs font-bold uppercase tracking-widest mb-4">Products · Insurance</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Insurance</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Comprehensive cover for your life, home, travels and income. Simple policies, no jargon — manage everything in the app.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["4", "Policy types"],
              ["from €4", "Cheapest policy"],
              ["€10M", "Max medical cover"],
              ["24/7", "Claims support"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dy-insurance-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
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
                  ["Cover", p.cover],
                  ["Premium", p.premium],
                  ["Term", p.term],
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
                href={`/products/insurance/${p.slug}`}
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
