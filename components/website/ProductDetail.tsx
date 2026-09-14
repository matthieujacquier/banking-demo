import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import LoanAmountCalculator from "@/components/website/LoanAmountCalculator";
import AskMuseButton from "@/components/website/AskMuseButton";
import CompareToggle from "@/components/website/CompareToggle";
import Rating from "@/components/website/Rating";
import { getProduct, type Product } from "@/lib/products";
import { CATEGORY_CONFIG, GOAL_LABEL, PERSONA_LABEL, specRows, termLabel } from "@/lib/catalog-config";
import { eur } from "@/lib/money";

const CARD = "bg-white rounded-3xl border border-[#D8E0ED] p-8";
const CARD_SHADOW = { boxShadow: "0 16px 34px rgba(11,13,18,0.07)" };

// Every number in the comparable schema that applies to this product, with
// the same label everywhere — the site and the feed can't disagree.
function ratesAndFees(p: Product): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  rows.push({ label: "Annual cost", value: p.price > 0 ? `${eur(p.price)} / year` : "Free" });
  if (p.monthlyFee > 0) rows.push({ label: "Monthly fee", value: `${eur(p.monthlyFee)} / month` });
  if (p.interestRate > 0) rows.push({ label: "APR (you pay)", value: `from ${p.interestRate}%` });
  if (p.aer > 0) rows.push({ label: "AER (you earn)", value: `${p.aer}%` });
  if (p.expectedReturnMax > 0)
    rows.push({ label: "Target return", value: `${p.expectedReturnMin}–${p.expectedReturnMax}% p.a.` });
  if (p.annualFeePct > 0) rows.push({ label: "Ongoing charge", value: `${p.annualFeePct}% of assets / year` });
  if (p.transactionFeePct > 0) rows.push({ label: "Per transaction", value: `${p.transactionFeePct}%` });
  if (p.fxFeePct > 0 || p.category === "Cards" || p.category === "Accounts")
    rows.push({ label: "FX markup", value: p.fxFeePct > 0 ? `${p.fxFeePct}%` : "0%" });
  if (p.cashbackPercent > 0) rows.push({ label: "Cashback", value: `up to ${p.cashbackPercent}%` });
  if (p.cashbackMonthlyCap > 0) rows.push({ label: "Cashback cap", value: `${eur(p.cashbackMonthlyCap)} / month` });
  if (p.minAmount > 0) rows.push({ label: "Minimum", value: eur(p.minAmount) + (p.contributionPeriod ? " / month" : "") });
  if (p.maxAmount > 0) rows.push({ label: "Maximum", value: eur(p.maxAmount) });
  if (p.termMonths > 0) rows.push({ label: "Term", value: termLabel(p) });
  if (p.noticeDays > 0) rows.push({ label: "Notice period", value: `${p.noticeDays} days` });
  if (p.minAge > 0) rows.push({ label: "Minimum age", value: `${p.minAge}` });
  if (p.minIncome > 0) rows.push({ label: "Minimum income", value: `${eur(p.minIncome)} / year` });
  return rows;
}

function riskLabel(level: number): string {
  if (level <= 2) return "Very low";
  if (level <= 4) return "Low to moderate";
  if (level <= 6) return "Moderate";
  if (level <= 8) return "High";
  return "Very high";
}

// A product detail page: hero, About / Key features / Eligibility, rates &
// fees, who it's for, FAQ, related products, and the sticky summary sidebar.
export default function ProductDetail({ product }: { product: Product }) {
  const cfg = CATEGORY_CONFIG[product.category];
  const name = product.shortName ?? product.name;
  const rows = specRows(product, "detail");
  const photoHero = cfg.heroStyle === "photo";
  const related = product.relatedSkus.map(getProduct).filter((p): p is Product => !!p);
  const fees = ratesAndFees(product);

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

            {/* Rates & fees — the comparable numbers */}
            <div className={CARD} style={CARD_SHADOW}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
                <h2 className="text-xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
                  Rates &amp; fees
                </h2>
                <Link href="/rates" className="text-xs font-bold text-[#2563FF] hover:underline">
                  Compare all rates →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
                {fees.map((row) => (
                  <div key={row.label} className="flex justify-between border-b border-[#D8E0ED] pb-2.5">
                    <span className="text-[#6B7280]">{row.label}</span>
                    <span className="font-semibold text-[#0B0D12] text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#6B7280] text-xs mt-4">{product.feeSummary}</p>
            </div>

            {/* Who it's for + risk */}
            <div className={CARD} style={CARD_SHADOW}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-5" style={{ letterSpacing: "-0.01em" }}>
                Who it&apos;s for
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.personas.map((p) => (
                  <span
                    key={p}
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ color: product.accent, backgroundColor: `${product.accent}18` }}
                  >
                    {PERSONA_LABEL[p]}
                  </span>
                ))}
                {product.goals.map((g) => (
                  <span
                    key={g}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F6F7FB] border border-[#D8E0ED] text-[#1F2937]"
                  >
                    {GOAL_LABEL[g]}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2">
                <span>Risk of capital loss</span>
                <span className="text-[#0B0D12]">
                  {product.riskLevel}/10 · {riskLabel(product.riskLevel)}
                </span>
              </div>
              <div className="flex gap-1" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-2 flex-1 rounded-full"
                    style={{
                      background:
                        i < product.riskLevel
                          ? product.riskLevel <= 3
                            ? "#119E5A"
                            : product.riskLevel <= 6
                              ? "#B7791F"
                              : "#D14343"
                          : "#E5E7EB",
                    }}
                  />
                ))}
              </div>
              <p className="text-[#6B7280] text-xs mt-3 leading-relaxed">{product.regulatoryNote}</p>
            </div>

            {/* FAQ */}
            <div className={CARD} style={CARD_SHADOW}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.01em" }}>
                Questions people ask
              </h2>
              <div className="divide-y divide-[#D8E0ED]">
                {product.faq.map((f) => (
                  <details key={f.q} className="group py-3">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-[#0B0D12]">
                      {f.q}
                      <span className="text-[#6B7280] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="text-[#6B7280] text-sm leading-relaxed mt-2 pr-6">{f.a}</p>
                  </details>
                ))}
              </div>
              <Link href="/help" className="inline-block mt-4 text-xs font-bold text-[#2563FF] hover:underline">
                More in the Help centre →
              </Link>
            </div>

            {/* Related products — a DY recommendations campaign can take this slot over */}
            {related.length > 0 && (
              <div id="dy-related-products">
                <h2 className="text-xl font-bold text-[#0B0D12] mb-5" style={{ letterSpacing: "-0.01em" }}>
                  Often paired with {name}
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.sku}
                      href={r.url}
                      className="bg-white rounded-2xl border border-[#D8E0ED] p-5 hover:border-[#2563FF]/50 transition-colors"
                      style={{ borderTop: `3px solid ${r.accent}` }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ color: r.accent, backgroundColor: `${r.accent}18` }}
                      >
                        {r.category}
                      </span>
                      <p className="font-bold text-[#0B0D12] mt-3 leading-snug">{r.name}</p>
                      <p className="text-[#6B7280] text-xs mt-1">{r.displayPrice}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-7 sticky top-20" style={CARD_SHADOW}>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-2">{cfg.sidebarHeading}</p>
              <div className="mb-4">
                <Rating rating={product.customerRating} count={product.reviewCount} />
              </div>
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
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors mb-3"
              >
                Talk to an Advisor
              </Link>
              <div className="mb-3">
                <AskMuseButton prompt={`Is the ${product.name} right for me? What should I know before choosing it?`} />
              </div>
              <CompareToggle sku={product.sku} variant="detail" />
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">{cfg.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
