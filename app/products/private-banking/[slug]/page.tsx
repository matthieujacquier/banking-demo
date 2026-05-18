import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  "relationship-manager": {
    sku: "PB-REL-001",
    category: "Relationship",
    accent: "#B45309",
    name: "Dedicated Relationship Manager",
    tagline: "A single named point of contact for every financial need.",
    aumThreshold: "€500,000+",
    feeStructure: "Tiered (0.4–0.8%)",
    commitment: "Annual review",
    description:
      "Your Dedicated Relationship Manager is your single point of contact across the entire NexaBank platform — from day-to-day banking to investments, credit and beyond. Reach them directly by phone, email or in person, with a quarterly review of your portfolio, goals and the wider market.",
    features: [
      "Single named relationship manager",
      "Direct phone, email and in-person access",
      "Quarterly portfolio and goals review",
      "Coordination across all your NexaBank services",
      "Annual relationship summary and outlook",
    ],
    eligibility: [
      "Minimum €500,000 in assets across NexaBank",
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Reference and source-of-wealth checks completed",
    ],
  },
  "wealth-planning": {
    sku: "PB-WLTH-001",
    category: "Wealth",
    accent: "#92400E",
    name: "Wealth Planning",
    tagline: "Long-term planning across succession, philanthropy and cross-border tax.",
    aumThreshold: "€2,000,000+",
    feeStructure: "Bespoke",
    commitment: "Multi-year mandate",
    description:
      "Wealth Planning addresses the questions that go beyond portfolio returns: how to pass wealth to the next generation, structure a family foundation, optimise tax across multiple jurisdictions, and align finances with personal values. Our in-house specialists work alongside your existing lawyers and accountants.",
    features: [
      "Succession and inheritance planning",
      "Cross-border tax optimisation",
      "Philanthropy and family foundation structures",
      "Coordination with external lawyers and accountants",
      "Annual strategy review with senior partners",
    ],
    eligibility: [
      "Minimum €2,000,000 in assets across NexaBank",
      "Existing Dedicated Relationship Manager",
      "Reference and source-of-wealth checks completed",
      "Engagement scoped via initial discovery meeting",
    ],
  },
  "credit-line": {
    sku: "PB-CRED-001",
    category: "Credit",
    accent: "#78350F",
    name: "Exclusive Credit Line",
    tagline: "Unsecured or asset-backed credit up to €10M, priced on relationship.",
    aumThreshold: "€1,000,000+",
    feeStructure: "Negotiated",
    commitment: "Revolving facility",
    description:
      "The Exclusive Credit Line gives Private Banking clients access to credit facilities that don't fit a standard underwriting box. Unsecured or backed by your investment portfolio, real estate or other assets, with pricing reflecting the full relationship rather than a published rate card. Drawdowns can be made in any major currency.",
    features: [
      "Credit lines up to €10M",
      "Unsecured or asset-backed structures",
      "Pricing based on the full client relationship",
      "Drawdown in any major currency",
      "Same-day decision on extension requests",
    ],
    eligibility: [
      "Minimum €1,000,000 in assets across NexaBank",
      "Existing Dedicated Relationship Manager",
      "Source-of-wealth and credit checks completed",
      "Facility scoped via individual underwriting",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function PrivateBankingProductPage({
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
            <Link href="/products/private-banking" className="text-white/70 hover:text-white transition-colors">
              Private Banking
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
                About this service
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
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Service summary</p>
              <div className="space-y-3 mb-7">
                {[
                  ["AUM threshold", product.aumThreshold],
                  ["Fee structure", product.feeStructure],
                  ["Commitment", product.commitment],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-3 text-sm">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12] text-right">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mb-3"
              >
                Request a Meeting
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                Eligibility subject to discovery meeting and source-of-wealth verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
