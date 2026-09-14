import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import ProductCard from "@/components/website/ProductCard";
import { productsByCategory } from "@/lib/products";

const STEPS = [
  { n: "1", title: "Open in a day", body: "Scan your registration documents and the directors' IDs. Sole traders are live the same day, companies within one working day." },
  { n: "2", title: "Plug in your tools", body: "Sync Xero, QuickBooks or Sage, issue team cards with limits, and set the VAT pot to fill itself." },
  { n: "3", title: "Get paid, grow", body: "Take card payments at 1.2% flat, invoice with payment links, and borrow up to €500,000 when the next step arrives." },
];

// Business hub — the persona `business` landing page.
export default function BusinessHubPage() {
  const products = productsByCategory("Business");

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["BUSINESS"] }} />
      <Navbar />

      <section id="dy-business-hero" className="relative bg-[#0B0D12] text-white py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 40%, #4F46E533 0%, #0B0D12 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-[#818CF8] text-xs font-bold uppercase tracking-widest mb-4">NexaBank Business</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
            Banking for businesses that don&apos;t stand still.
          </h1>
          <p className="text-white/70 max-w-2xl text-lg mb-10">
            Accounts, payments, FX and lending for sole traders, start-ups and companies up to 50 people — with the
            admin done for you.
          </p>
          <div className="flex flex-wrap gap-3 mb-12">
            <Link
              href="/contact"
              className="bg-white text-[#0B0D12] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
            >
              Open a business account
            </Link>
            <Link
              href="/products/business"
              className="border border-white/25 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
            >
              All business products
            </Link>
          </div>
          <div className="flex flex-wrap gap-10">
            {[
              ["€9/mo", "Business account, first 3 months free"],
              ["1.2%", "Flat card acceptance fee"],
              ["0.4%", "FX markup on 30+ currencies"],
              ["48h", "Lending decision"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  {value}
                </p>
                <p className="text-white/55 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#F6F7FB]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#4F46E5] text-xs font-bold uppercase tracking-widest mb-3">How it works</p>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white rounded-3xl border border-[#D8E0ED] p-7" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-[#4F46E5] text-white font-bold text-sm mb-4">
                  {s.n}
                </span>
                <h2 className="font-bold text-[#0B0D12] text-xl mb-2" style={{ letterSpacing: "-0.01em" }}>
                  {s.title}
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dy-business-products" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B0D12] mb-8" style={{ letterSpacing: "-0.025em" }}>
            Run your business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0D12] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
            Talk to a business advisor
          </h2>
          <p className="text-white/70 mb-8">
            Thirty minutes, no obligation — we&apos;ll map your invoicing, payments and lending needs to the right setup.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#0B0D12] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
          >
            Book a call
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
