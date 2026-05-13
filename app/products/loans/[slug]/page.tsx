import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  "car-loan": {
    sku: "LOAN-VEH-001",
    name: "Car Loan",
    tagline: "Drive away today with flexible financing",
    rate: "from 5.5% APR",
    amount: "€3,000 – €75,000",
    term: "12 – 72 months",
    description:
      "Whether you're buying new or used, our Car Loan gives you the freedom to choose the vehicle you want at a rate that works for you. Fast approval, no hidden fees, and flexible repayment terms.",
    features: [
      "Same-day approval decision",
      "Finance new and used vehicles",
      "No early repayment penalty",
      "Fixed monthly payments",
    ],
  },
  "real-estate-loan": {
    sku: "LOAN-REAL-001",
    name: "Real Estate Loan",
    tagline: "Your home journey starts here",
    rate: "from 3.9% APR",
    amount: "€50,000 – €1,000,000",
    term: "5 – 30 years",
    description:
      "From first-time buyers to seasoned investors, our Real Estate Loan offers competitive rates and long-term flexibility to help you secure the property you've been dreaming of.",
    features: [
      "Dedicated mortgage advisor",
      "Fixed and variable rate options",
      "Up to 90% loan-to-value",
      "Free property valuation",
    ],
  },
  "short-term-loan": {
    sku: "LOAN-SHORT-001",
    name: "Short Term Loan",
    tagline: "Fast cash when you need it most",
    rate: "from 8.9% APR",
    amount: "€500 – €10,000",
    term: "1 – 24 months",
    description:
      "Need funds quickly for an unexpected expense? Our Short Term Loan puts money in your account within 24 hours with minimal paperwork and a straightforward repayment schedule.",
    features: [
      "Funds in 24 hours",
      "No collateral required",
      "Minimal documentation",
      "Flexible repayment schedule",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function LoanProductPage({
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
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/products/loans" className="text-[#6B7280] hover:text-[#2563FF] transition-colors">
              Loans
            </Link>
            <span className="text-[#6B7280]">›</span>
            <span className="text-white">{product.name}</span>
          </div>
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">
            SKU: {product.sku}
          </p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>
            {product.name}
          </h1>
          <p className="text-[#6B7280] text-lg max-w-xl">{product.tagline}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          {/* Main info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.01em" }}>
                About this loan
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
                    <span className="text-[#119E5A] font-bold mt-0.5">✓</span>
                    <span className="text-[#1F2937]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-7 sticky top-20" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <div className="space-y-4 mb-7">
                {[
                  ["Rate", product.rate],
                  ["Amount", product.amount],
                  ["Term", product.term],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-3 text-sm">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12]">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/login"
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
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
