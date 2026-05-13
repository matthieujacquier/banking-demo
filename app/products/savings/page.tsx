import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import Link from "next/link";

const accounts = [
  { name: "Easy Saver", tagline: "Flexible access, great rates", apy: "3.5% AER", min: "€0", notice: "Instant access" },
  { name: "Fixed Rate Bond", tagline: "Lock in a rate, maximise returns", apy: "4.8% AER", min: "€1,000", notice: "12-month term" },
  { name: "Junior ISA", tagline: "Start their future today", apy: "4.2% AER", min: "€10/month", notice: "Until age 18" },
];

export default function SavingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Products</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Savings Accounts</h1>
          <p className="text-[#6B7280] max-w-xl text-lg">Make your money work harder with market-leading rates and zero fees.</p>
        </div>
      </section>

      {/* DY targets this section for personalised savings offers */}
      <section id="dy-savings-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div key={acc.name} className="bg-white rounded-3xl border border-[#D8E0ED] p-7 flex flex-col" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h3 className="font-semibold text-[#0B0D12] text-xl mb-1" style={{ letterSpacing: "-0.01em" }}>{acc.name}</h3>
              <p className="text-[#6B7280] text-sm mb-7">{acc.tagline}</p>
              <div className="space-y-3 text-sm flex-1 mb-7">
                <div className="flex justify-between border-b border-[#D8E0ED] pb-3">
                  <span className="text-[#6B7280]">Interest rate</span>
                  <span className="font-bold text-[#119E5A] text-base">{acc.apy}</span>
                </div>
                <div className="flex justify-between border-b border-[#D8E0ED] pb-3">
                  <span className="text-[#6B7280]">Minimum deposit</span>
                  <span className="font-semibold text-[#0B0D12]">{acc.min}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Access</span>
                  <span className="font-semibold text-[#0B0D12]">{acc.notice}</span>
                </div>
              </div>
              <Link href="/login" className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors">
                Open Account
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
