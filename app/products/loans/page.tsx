import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const loans = [
  {
    slug: "real-estate-loan",
    category: "Real Estate",
    accent: "#2563FF",
    name: "Real Estate Loan",
    description: "Finance your property purchase with competitive fixed and variable rates and terms up to 30 years.",
    badge: "Up to 90% LTV",
    rate: "from 3.9% APR",
    amount: "€50,000 – €1,000,000",
    term: "Up to 30 years",
  },
  {
    slug: "car-loan",
    category: "Vehicle",
    accent: "#0891B2",
    name: "Vehicle Financing",
    description: "Drive away sooner with flexible financing for new and used cars, with same-day approval decisions.",
    badge: "Same-day approval",
    rate: "from 5.5% APR",
    amount: "€3,000 – €75,000",
    term: "12 – 72 months",
  },
  {
    slug: "short-term-loan",
    category: "Short Term",
    accent: "#EA580C",
    name: "Short Term Loan",
    description: "Fast funds in 24 hours for unexpected expenses. No collateral required, minimal paperwork.",
    badge: "Funds in 24h",
    rate: "from 8.9% APR",
    amount: "€500 – €10,000",
    term: "Up to 24 months",
  },
  {
    slug: "student-loan",
    category: "Education",
    accent: "#16A34A",
    name: "Student Loan",
    description: "Invest in your future with low-rate education financing and flexible deferred repayment options.",
    badge: "Deferred repayment",
    rate: "from 2.9% APR",
    amount: "€1,000 – €25,000",
    term: "Up to 10 years",
  },
  {
    slug: "renovation-loan",
    category: "Home Improvement",
    accent: "#7C3AED",
    name: "House Renovation Loan",
    description: "Transform your home with dedicated renovation financing at competitive rates and flexible terms.",
    badge: "Decision in 48h",
    rate: "from 4.5% APR",
    amount: "€5,000 – €100,000",
    term: "Up to 10 years",
  },
];

export default function LoansPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Loans"] }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Products · Loans</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Personal Loans</h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Transparent rates, no hidden fees, and a lending experience built for modern life.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              ["from 2.9%", "APR interest rate"],
              ["€1,000,000", "Maximum loan amount"],
              ["5", "Loan types"],
              ["24h", "Decision time"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loans grid */}
      <section id="dy-loans-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <div
              key={loan.slug}
              className="bg-white rounded-3xl border border-[#D8E0ED] p-7 flex flex-col"
              style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)", borderTop: `3px solid ${loan.accent}` }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: loan.accent, backgroundColor: `${loan.accent}18` }}
                >
                  {loan.category}
                </span>
                <span className="text-xs font-semibold text-[#6B7280] bg-[#F6F7FB] border border-[#D8E0ED] px-2.5 py-1 rounded-full">
                  {loan.badge}
                </span>
              </div>
              <h3 className="font-bold text-[#0B0D12] text-xl mb-2" style={{ letterSpacing: "-0.01em" }}>
                {loan.name}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 flex-1">{loan.description}</p>
              <div className="space-y-2.5 text-sm mb-6">
                {[["Rate", loan.rate], ["Amount", loan.amount], ["Term", loan.term]].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-2.5">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/products/loans/${loan.slug}`}
                  className="flex-1 block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
                >
                  Learn More
                </Link>
                <Link
                  href="/login"
                  className="flex-1 block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
