import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  "nexa-start": {
    sku: "CARD-START-001",
    category: "Free",
    accent: "#16A34A",
    name: "NexaStart",
    tagline: "Start your credit journey with no annual fee and real cashback from day one.",
    fee: "€0 / year",
    cashback: "1%",
    creditLimit: "Up to €3,000",
    description:
      "NexaStart is built for first-time card holders and anyone rebuilding their credit history. There's no annual fee, no minimum income requirement, and you earn 1% cashback on every purchase from the moment your card arrives. Spending insights in the app help you stay on top of your balance and build healthy habits.",
    features: [
      "No annual fee, ever",
      "1% cashback on all purchases, paid monthly",
      "Build or rebuild your credit score",
      "Real-time spending insights in the NexaBank app",
      "Apple Pay and Google Pay supported",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Valid government-issued ID",
      "Active NexaBank current account",
      "No active bankruptcy proceedings",
    ],
  },
  "nexa-essential": {
    sku: "CARD-ESS-001",
    category: "Essential",
    accent: "#2563FF",
    name: "NexaEssential",
    tagline: "Everyday versatility with travel cover and purchase protection built in.",
    fee: "€49 / year",
    cashback: "0.5%",
    creditLimit: "Up to €10,000",
    description:
      "NexaEssential is the everyday card for people who want a reliable mid-tier credit card with the extras that matter: basic travel insurance, purchase protection up to €1,000, and round-the-clock fraud monitoring. A modest annual fee gets you a higher credit limit and more comprehensive cover than NexaStart.",
    features: [
      "0.5% cashback on all purchases",
      "Basic travel insurance included for cardholder",
      "Purchase protection up to €1,000 per item",
      "Contactless and virtual card numbers for online use",
      "24/7 fraud monitoring with instant alerts",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Minimum net monthly income of €2,000",
      "Active NexaBank current account",
      "Good credit history (no recent defaults)",
    ],
  },
  "nexa-nomad": {
    sku: "CARD-NOM-001",
    category: "Travel",
    accent: "#0891B2",
    name: "NexaNomad",
    tagline: "No FX fees, lounge access, and full travel cover — made for travellers.",
    fee: "€99 / year",
    cashback: "1.5%",
    creditLimit: "Up to €20,000",
    description:
      "NexaNomad removes the friction from international spending. There are no foreign transaction fees, ever, and you earn 1.5% cashback on every purchase whether at home or abroad. Two complimentary lounge visits per year and comprehensive travel and medical insurance round out a card designed for people who live across borders.",
    features: [
      "1.5% cashback on all purchases",
      "No foreign transaction fees worldwide",
      "2 free airport lounge visits per year",
      "Comprehensive travel and medical insurance",
      "Emergency card replacement anywhere in the world",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Minimum net monthly income of €3,500",
      "Active NexaBank current account",
      "Excellent credit history",
    ],
  },
  "nexa-prestige": {
    sku: "CARD-PRES-001",
    category: "Premium",
    accent: "#B45309",
    name: "NexaPrestige",
    tagline: "Our most exclusive card — concierge service, maximum cover, premium perks.",
    fee: "€299 / year",
    cashback: "2%",
    creditLimit: "Up to €100,000",
    description:
      "NexaPrestige is reserved for our most discerning clients. A dedicated 24/7 personal concierge, unlimited airport lounge access, our highest cashback rate, and the lowest APR in the range. Maximum insurance coverage means you can travel and spend with absolute confidence, knowing every detail is taken care of.",
    features: [
      "2% cashback on all purchases — our highest rate",
      "24/7 personal concierge service for any request",
      "Unlimited airport lounge access worldwide",
      "Maximum insurance coverage on travel, purchases and rentals",
      "Dedicated priority customer support line",
    ],
    eligibility: [
      "Aged 25 or over and EU resident",
      "Minimum net monthly income of €8,000",
      "Active NexaBank current account",
      "Excellent credit history and clean financial record",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function CreditCardProductPage({
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
      <section
        className="relative bg-[#0B0D12] text-white py-32 px-6 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 25% 50%, ${product.accent}22 0%, #0B0D12 62%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/products/credit-cards" className="text-white/70 hover:text-white transition-colors">
              Credit Cards
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
                About this card
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
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Card summary</p>
              <div className="space-y-3 mb-7">
                {[
                  ["Annual fee", product.fee],
                  ["Cashback", product.cashback],
                  ["Credit limit", product.creditLimit],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-3 text-sm">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12]">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/signup?product=${product.sku}`}
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mb-3"
              >
                Apply Now
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                Credit subject to status. Representative APR varies by card and credit profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
