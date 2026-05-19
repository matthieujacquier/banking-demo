import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import LoanAmountCalculator from "@/components/website/LoanAmountCalculator";
import Link from "next/link";

const PRODUCTS = {
  "car-loan": {
    sku: "LOAN-VEH-001",
    category: "Vehicle",
    accent: "#0891B2",
    hero: "/loans/car-loan.jpg",
    name: "Vehicle Financing",
    tagline: "Drive away sooner with flexible financing for new and used cars.",
    rate: "from 5.5% APR",
    amount: "€3,000 – €75,000",
    term: "12 – 72 months",
    description:
      "Whether you're buying new or used, our Vehicle Financing gives you the freedom to choose the car you want at a rate that works for you. Get a same-day approval decision, with no hidden fees and fixed monthly repayments across terms of up to 72 months.",
    features: [
      "Same-day approval decision",
      "Finance new and used vehicles up to €75,000",
      "No early repayment penalty",
      "Fixed monthly payments for the full term",
      "Dedicated loan advisor on request",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Minimum net monthly income of €1,500",
      "Valid driving licence",
      "No recent adverse credit history",
    ],
  },
  "real-estate-loan": {
    sku: "LOAN-REAL-001",
    category: "Real Estate",
    accent: "#2563FF",
    hero: "/loans/real-estate-loan.jpg",
    name: "Real Estate Loan",
    tagline: "Your home journey starts here — competitive rates, long-term flexibility.",
    rate: "from 3.9% APR",
    amount: "€50,000 – €3,000,000",
    term: "Up to 30 years",
    description:
      "From first-time buyers to seasoned investors, our Real Estate Loan offers competitive rates and the flexibility to match your project. Choose between fixed and variable rates, borrow up to 90% of the property value, and benefit from a free valuation included with every application.",
    features: [
      "Fixed and variable rate options",
      "Up to 90% loan-to-value",
      "Free property valuation included",
      "Dedicated mortgage advisor throughout the process",
      "No early repayment fee on variable rate",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Minimum net monthly income of €2,500",
      "Property located within the EU",
      "Proof of deposit (minimum 10%)",
    ],
  },
  "short-term-loan": {
    sku: "LOAN-SHORT-001",
    category: "Short Term",
    accent: "#EA580C",
    hero: "/loans/short-term-loan.jpg",
    name: "Short Term Loan",
    tagline: "Fast funds when you need them — in your account within 24 hours.",
    rate: "from 8.9% APR",
    amount: "€500 – €10,000",
    term: "Up to 24 months",
    description:
      "Life doesn't always wait. Our Short Term Loan puts money in your account within 24 hours of approval, with minimal paperwork and no collateral required. A straightforward repayment schedule means no surprises — just the funds you need, when you need them.",
    features: [
      "Funds credited within 24 hours of approval",
      "No collateral or guarantor required",
      "Minimal documentation — apply entirely online",
      "Flexible repayment schedule from 1 to 24 months",
      "Early repayment at no additional cost",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Minimum net monthly income of €1,000",
      "No active loan defaults",
    ],
  },
  "student-loan": {
    sku: "LOAN-STU-001",
    category: "Education",
    accent: "#16A34A",
    hero: "/loans/student-loan.jpg",
    name: "Student Loan",
    tagline: "Invest in your education — our lowest rates, built for students.",
    rate: "from 2.9% APR",
    amount: "€1,000 – €25,000",
    term: "Up to 10 years",
    description:
      "Our Student Loan is designed to remove financial barriers to education. With our lowest available rate and the option to defer repayments until after you graduate, you can focus on your studies without the pressure of immediate repayments. Covers tuition fees, accommodation, and living expenses.",
    features: [
      "Defer repayments until 6 months after graduation",
      "Our lowest rate — from 2.9% APR",
      "Covers tuition, accommodation and living costs",
      "No early repayment penalty",
      "Flexible repayment terms up to 10 years",
    ],
    eligibility: [
      "Aged 17 or over and EU resident",
      "Enrolled in an accredited university or institution",
      "Co-signatory required for applicants under 18",
      "Annual enrolment confirmation required",
    ],
  },
  "renovation-loan": {
    sku: "LOAN-RENO-001",
    category: "Home Improvement",
    accent: "#7C3AED",
    hero: "/loans/renovation-loan.jpg",
    name: "House Renovation Loan",
    tagline: "Transform your home — from kitchen to full refurbishment.",
    rate: "from 4.5% APR",
    amount: "€5,000 – €100,000",
    term: "Up to 10 years",
    description:
      "Whether you're planning a kitchen remodel, a new bathroom, or a full home refurbishment, our House Renovation Loan gives you the funds to bring your project to life. Choose your own contractor, receive a decision within 48 hours, and benefit from stage-release funding on larger projects.",
    features: [
      "No restriction on contractor choice",
      "Stage-release funding available for larger projects",
      "Decision within 48 hours",
      "Fixed monthly payments throughout the term",
      "No early repayment penalty",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Property owner within the EU",
      "Minimum net monthly income of €1,800",
      "Renovation project located within the EU",
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
      <section
        className="relative bg-[#0B0D12] text-white py-32 px-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${product.hero})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,13,18,0.85) 0%, rgba(11,13,18,0.65) 50%, rgba(11,13,18,0.25) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/products/loans" className="text-white/70 hover:text-white transition-colors">
              Loans
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

          {/* Main info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.01em" }}>
                About this loan
              </h2>
              <p className="text-[#6B7280] leading-relaxed">{product.description}</p>
            </div>

            {slug === "real-estate-loan" && (
              <LoanAmountCalculator
                productSku={product.sku}
                accentColor={product.accent}
                apr={3.9}
                minAmount={50_000}
                maxAmount={3_000_000}
              />
            )}

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

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-7 sticky top-20" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Loan summary</p>
              <div className="space-y-3 mb-7">
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
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                Representative APR shown. Your rate may vary based on your credit profile and loan amount.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
