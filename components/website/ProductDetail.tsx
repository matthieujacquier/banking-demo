import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import LoanAmountCalculator from "@/components/website/LoanAmountCalculator";
import type { Product } from "@/lib/products";
import { CATEGORY_CONFIG, specRows } from "@/lib/catalog-config";

const CARD = "bg-white rounded-3xl border border-[#D8E0ED] p-8";
const CARD_SHADOW = { boxShadow: "0 16px 34px rgba(11,13,18,0.07)" };

// A product detail page: hero, About / Key features / Eligibility, and the
// sticky summary sidebar with the category's CTA and disclaimer.
export default function ProductDetail({ product }: { product: Product }) {
  const cfg = CATEGORY_CONFIG[product.category];
  const name = product.shortName ?? product.name;
  const rows = specRows(product, "detail");
  const photoHero = cfg.heroStyle === "photo";

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "PRODUCT", data: [product.sku] }} />
      <Navbar />

      {/* Hero */}
      <section
        className={
          photoHero
            ? "relative bg-[#0B0D12] text-white py-32 px-6 bg-cover bg-center"
            : "relative bg-[#0B0D12] text-white py-32 px-6 overflow-hidden"
        }
        style={photoHero ? { backgroundImage: `url(${product.imageUrl})` } : undefined}
      >
        {photoHero ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(11,13,18,0.85) 0%, rgba(11,13,18,0.65) 50%, rgba(11,13,18,0.25) 100%)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 25% 50%, ${product.accent}22 0%, #0B0D12 62%)`,
            }}
          />
        )}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href={`/products/${cfg.routeSlug}`} className="text-white/70 hover:text-white transition-colors">
              {cfg.breadcrumb}
            </Link>
            <span className="text-white/70">›</span>
            <span className="text-white">{name}</span>
          </div>
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-5"
            style={{ color: product.accent, backgroundColor: `${product.accent}25` }}
          >
            {product.subcategory}
          </span>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>
            {name}
          </h1>
          <p className="text-white/85 text-lg max-w-xl">{product.tagline}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Main info */}
          <div className="md:col-span-2 space-y-6">
            <div className={CARD} style={CARD_SHADOW}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.01em" }}>
                {cfg.aboutHeading}
              </h2>
              <p className="text-[#6B7280] leading-relaxed">{product.longDescription}</p>
            </div>

            {product.tools?.includes("loan-calculator") && (
              <LoanAmountCalculator
                productSku={product.sku}
                accentColor={product.accent}
                apr={product.interestRate}
                minAmount={product.minAmount}
                maxAmount={product.maxAmount}
              />
            )}

            <div className={CARD} style={CARD_SHADOW}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-5" style={{ letterSpacing: "-0.01em" }}>
                Key features
              </h2>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 items-start">
                    <span className="font-bold mt-0.5" style={{ color: product.accent }}>
                      ✓
                    </span>
                    <span className="text-[#1F2937] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={CARD} style={CARD_SHADOW}>
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
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-7 sticky top-20" style={CARD_SHADOW}>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">{cfg.sidebarHeading}</p>
              <div className="space-y-3 mb-7">
                {rows.map((row) => (
                  <div key={row.label} className="flex justify-between border-b border-[#D8E0ED] pb-3 text-sm">
                    <span className="text-[#6B7280]">{row.label}</span>
                    <span className="font-semibold text-[#0B0D12] text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <Link
                href={cfg.detailCta.href(product)}
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mb-3"
              >
                {cfg.detailCta.label}
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">{cfg.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
