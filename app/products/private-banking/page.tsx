import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const products = [
  {
    sku: "PB-REL-001",
    slug: "relationship-manager",
    category: "Relationship",
    accent: "#B45309",
    name: "Dedicated Relationship Manager",
    description:
      "A single point of contact for every financial need — accessible by phone, email or in person, at any time.",
    badge: "Always available",
    aumThreshold: "€500,000+",
    feeStructure: "Tiered (0.4–0.8%)",
    commitment: "Annual review",
    perks: [
      "Single named relationship manager",
      "Direct phone, email and in-person access",
      "Quarterly portfolio and goals review",
      "Coordination across all your NexaBank services",
      "Annual relationship summary and outlook",
    ],
  },
  {
    sku: "PB-WLTH-001",
    slug: "wealth-planning",
    category: "Wealth",
    accent: "#92400E",
    name: "Wealth Planning",
    description:
      "Long-term wealth planning covering succession, philanthropy and cross-border tax — handled by our in-house specialists.",
    badge: "Multi-generational",
    aumThreshold: "€2,000,000+",
    feeStructure: "Bespoke",
    commitment: "Multi-year mandate",
    perks: [
      "Succession and inheritance planning",
      "Cross-border tax optimisation",
      "Philanthropy and family foundation structures",
      "Coordination with external lawyers and accountants",
      "Annual strategy review with senior partners",
    ],
  },
  {
    sku: "PB-CRED-001",
    slug: "credit-line",
    category: "Credit",
    accent: "#78350F",
    name: "Exclusive Credit Line",
    description:
      "Unsecured or asset-backed credit facilities up to €10M, priced on relationship, not on tick-box criteria.",
    badge: "Up to €10M",
    aumThreshold: "€1,000,000+",
    feeStructure: "Negotiated",
    commitment: "Revolving facility",
    perks: [
      "Credit lines up to €10M",
      "Unsecured or asset-backed structures",
      "Pricing based on full client relationship",
      "Drawdown in any major currency",
      "Same-day decision on extension requests",
    ],
  },
];

export default function PrivateBankingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Private Banking"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#B45309] text-xs font-bold uppercase tracking-widest mb-4">Products · Private Banking</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Private Banking</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Exclusive banking for exceptional lives — a dedicated relationship manager, bespoke credit facilities, and long-horizon wealth planning.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["€500K+", "Entry threshold"],
              ["€10M", "Max credit line"],
              ["3", "Service pillars"],
              ["24/7", "Manager access"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dy-private-banking-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
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
                  ["AUM threshold", p.aumThreshold],
                  ["Fee structure", p.feeStructure],
                  ["Commitment", p.commitment],
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
                href={`/products/private-banking/${p.slug}`}
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
