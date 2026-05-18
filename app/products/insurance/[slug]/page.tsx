import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  "life-insurance": {
    sku: "INS-LIFE-001",
    category: "Life",
    accent: "#EA580C",
    name: "Life Insurance",
    tagline: "A lump-sum payout to your beneficiaries if the worst happens.",
    cover: "€50,000 – €1,000,000",
    premium: "from €8 / month",
    term: "10–30 years",
    description:
      "Life Insurance from NexaBank is straightforward cover designed for people with families or dependents. Choose level cover (a fixed amount) or decreasing cover (designed to track a mortgage), with optional critical illness rider to pay out earlier on diagnosis of a major illness. Premiums are fixed for the full term.",
    features: [
      "Choice of level or decreasing cover",
      "Optional critical illness rider",
      "No medical exam for cover up to €150,000",
      "Premiums fixed for the full term",
      "Cover for one or two lives on a single policy",
    ],
    eligibility: [
      "Aged 18 to 65 at policy start",
      "EU resident",
      "Health questionnaire completed at application",
      "Active NexaBank current account",
    ],
  },
  "home-insurance": {
    sku: "INS-HOME-001",
    category: "Home",
    accent: "#C2410C",
    name: "Home Insurance",
    tagline: "Buildings and contents cover for owners and renters, with flexible add-ons.",
    cover: "Buildings up to €1M",
    premium: "from €12 / month",
    term: "12-month renewable",
    description:
      "Home Insurance covers the structure of your home and everything inside it. Specify high-value items individually, add accidental damage cover for a few euros a month, and rely on 24/7 emergency assistance for plumbing, electrical or lock-out emergencies. Available to owners and renters.",
    features: [
      "Buildings cover up to €1M",
      "Contents cover up to €100,000",
      "Optional accidental damage cover",
      "Specified valuables add-on for high-value items",
      "24/7 emergency home assistance included",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Property located within the EU",
      "Active NexaBank current account",
      "Property not used commercially",
    ],
  },
  "travel-insurance": {
    sku: "INS-TRAV-001",
    category: "Travel",
    accent: "#F97316",
    name: "Travel Insurance",
    tagline: "Single-trip or annual multi-trip cover, including winter sports.",
    cover: "Medical up to €10M",
    premium: "from €4 / trip",
    term: "Single or annual",
    description:
      "Travel Insurance covers medical emergencies abroad, cancellation, curtailment, lost or delayed baggage, and personal liability. Add winter sports cover for the season, or upgrade to an annual multi-trip policy if you travel more than twice a year. Already free with the NexaNomad credit card.",
    features: [
      "Worldwide medical cover up to €10M",
      "Cancellation and curtailment cover",
      "Lost or delayed baggage protection",
      "Optional winter sports add-on",
      "Free with the NexaNomad credit card",
    ],
    eligibility: [
      "Aged 18 to 75 at trip start",
      "EU resident",
      "Trip starts and ends in the country of residence",
      "Pre-existing medical conditions declared",
    ],
  },
  "income-protection": {
    sku: "INS-INC-001",
    category: "Income",
    accent: "#9A3412",
    name: "Income Protection",
    tagline: "Replaces a portion of your income if illness or injury prevents you from working.",
    cover: "Up to 70% of income",
    premium: "from €15 / month",
    term: "To retirement age",
    description:
      "Income Protection pays a tax-free monthly benefit if you cannot work due to illness or injury. Cover up to 70% of your pre-tax income, choose a deferred period from 4 to 52 weeks, and add inflation-linking so your benefit keeps pace with rising costs. Particularly valuable for the self-employed.",
    features: [
      "Tax-free monthly payouts",
      "Cover up to 70% of pre-tax income",
      "Available to employed and self-employed",
      "Choice of deferred periods from 4 to 52 weeks",
      "Optional inflation-linking on benefit amount",
    ],
    eligibility: [
      "Aged 18 to 60 at policy start",
      "EU resident",
      "In active employment or self-employment",
      "Health questionnaire completed at application",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function InsuranceProductPage({
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
            <Link href="/products/insurance" className="text-white/70 hover:text-white transition-colors">
              Insurance
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
                About this policy
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
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Policy summary</p>
              <div className="space-y-3 mb-7">
                {[
                  ["Cover", product.cover],
                  ["Premium", product.premium],
                  ["Term", product.term],
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
                Get a Quote
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                Premiums shown are indicative. Final premium depends on personal details and underwriting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
