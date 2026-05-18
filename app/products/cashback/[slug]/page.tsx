import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  "cashback-card": {
    sku: "CASH-CARD-001",
    category: "Cashback Card",
    accent: "#EC4899",
    name: "Cashback Credit Card",
    tagline: "Elevated cashback on groceries, fuel and online subscriptions.",
    cashbackRate: "up to 3%",
    monthlyCap: "€150",
    fee: "€59 / year",
    description:
      "The Cashback Credit Card is a dedicated rewards card focused on the categories where people spend most. Earn 3% back on groceries and fuel, 1.5% on online subscriptions, and 1% on everything else. Cashback is credited as a statement credit at the end of each billing cycle — no points, no portals, no fuss.",
    features: [
      "3% cashback on groceries and fuel",
      "1.5% cashback on online subscriptions (Netflix, Spotify, etc.)",
      "1% cashback on everything else",
      "Cashback credited as statement credit each month",
      "Apple Pay and Google Pay supported",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Minimum net monthly income of €2,500",
      "Active NexaBank current account",
      "Good credit history (no recent defaults)",
    ],
  },
  "rewards-programme": {
    sku: "CASH-REW-001",
    category: "Rewards",
    accent: "#DB2777",
    name: "Cashback Rewards Programme",
    tagline: "Stackable cashback at 300+ partner brands — free for all NexaBank customers.",
    cashbackRate: "up to 10%",
    monthlyCap: "No cap",
    fee: "€0",
    description:
      "The Cashback Rewards Programme is a free loyalty layer that runs on top of whatever NexaBank card you carry. Activate an offer in the app before you shop, and you'll earn an extra 2–10% cashback at over 300 partner brands across travel, retail, dining and lifestyle. Rewards stack on top of any cashback your card already earns.",
    features: [
      "Earn 2–10% extra cashback at 300+ partner brands",
      "Stacks on top of your card cashback",
      "Activate offers in one tap in the NexaBank app",
      "Rewards credited within 48 hours of purchase",
      "Free for every NexaBank customer — no fee, no minimum",
    ],
    eligibility: [
      "Active NexaBank current account",
      "Aged 18 or over and EU resident",
      "Marketing communications opt-in for partner alerts",
      "Eligible NexaBank card used for the qualifying purchase",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function CashbackProductPage({
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
            <Link href="/products/cashback" className="text-white/70 hover:text-white transition-colors">
              Cashback
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
                  ["Cashback rate", product.cashbackRate],
                  ["Monthly cap", product.monthlyCap],
                  ["Fee", product.fee],
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
                Activate Rewards
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                Cashback rates and partner offers may change. Check the app for current rates before purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
