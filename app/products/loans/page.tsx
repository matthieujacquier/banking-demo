import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const loans = [
  { slug: "car-loan", name: "Car Loan", tagline: "Drive away today with flexible financing", rate: "from 5.5% APR", amount: "€3,000 – €75,000", term: "12 – 72 months" },
  { slug: "real-estate-loan", name: "Real Estate Loan", tagline: "Your home journey starts here", rate: "from 3.9% APR", amount: "€50,000 – €1,000,000", term: "5 – 30 years" },
  { slug: "short-term-loan", name: "Short Term Loan", tagline: "Fast cash when you need it most", rate: "from 8.9% APR", amount: "€500 – €10,000", term: "1 – 24 months" },
];

export default function LoansPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: ["Loans"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Products</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Personal Loans</h1>
          <p className="text-[#6B7280] max-w-xl text-lg">Flexible financing for every goal. Transparent rates, no hidden fees.</p>
        </div>
      </section>

      {/* DY targets this section for personalised loan offers */}
      <section id="dy-loans-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <div key={loan.name} className="bg-white rounded-3xl border border-[#D8E0ED] p-7 flex flex-col" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h3 className="font-semibold text-[#0B0D12] text-xl mb-1" style={{ letterSpacing: "-0.01em" }}>{loan.name}</h3>
              <p className="text-[#6B7280] text-sm mb-7">{loan.tagline}</p>
              <div className="space-y-3 text-sm flex-1 mb-7">
                {[["Rate", loan.rate], ["Amount", loan.amount], ["Term", loan.term]].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-3">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href={`/products/loans/${loan.slug}`} className="flex-1 block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors">
                  Learn More
                </Link>
                <Link href="/login" className="flex-1 block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors">
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
