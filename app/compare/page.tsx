import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Rating from "@/components/website/Rating";
import { PRODUCTS, getProduct, type Product } from "@/lib/products";
import { CATEGORY_CONFIG, CATEGORY_CONFIGS, PERSONA_LABEL, termLabel } from "@/lib/catalog-config";
import { eur } from "@/lib/money";

// Side-by-side comparison of up to three products (?skus=A,B,C). Every row
// is a column of the comparable feed schema, so anything can be compared
// with anything.

const MAX = 3;

interface Row {
  label: string;
  value: (p: Product) => string;
}

const ROWS: Row[] = [
  { label: "Category", value: (p) => `${p.category} · ${p.subcategory}` },
  { label: "Headline", value: (p) => p.displayPrice },
  { label: "Annual cost", value: (p) => (p.price > 0 ? `${eur(p.price)} / year` : "Free") },
  { label: "Monthly fee", value: (p) => (p.monthlyFee > 0 ? `${eur(p.monthlyFee)} / month` : "—") },
  { label: "APR (you pay)", value: (p) => (p.interestRate > 0 ? `from ${p.interestRate}%` : "—") },
  { label: "AER (you earn)", value: (p) => (p.aer > 0 ? `${p.aer}%` : "—") },
  {
    label: "Target return",
    value: (p) => (p.expectedReturnMax > 0 ? `${p.expectedReturnMin}–${p.expectedReturnMax}% p.a.` : "—"),
  },
  { label: "Ongoing charge", value: (p) => (p.annualFeePct > 0 ? `${p.annualFeePct}% of assets / year` : "—") },
  { label: "Per transaction", value: (p) => (p.transactionFeePct > 0 ? `${p.transactionFeePct}%` : "—") },
  { label: "FX markup", value: (p) => `${p.fxFeePct}%` },
  { label: "Cashback", value: (p) => (p.cashbackPercent > 0 ? `up to ${p.cashbackPercent}%` : "—") },
  { label: "Minimum", value: (p) => (p.minAmount > 0 ? eur(p.minAmount) + (p.contributionPeriod ? " / month" : "") : "None") },
  { label: "Maximum", value: (p) => (p.maxAmount > 0 ? eur(p.maxAmount) : "No cap") },
  { label: "Term", value: (p) => (p.termMonths > 0 ? termLabel(p) : "Open-ended") },
  { label: "Notice", value: (p) => (p.noticeDays > 0 ? `${p.noticeDays} days` : "Instant") },
  { label: "Access", value: (p) => p.access ?? p.liquidity.replace(/_/g, " ") },
  { label: "Risk of capital loss", value: (p) => `${p.riskLevel}/10` },
  { label: "Minimum age", value: (p) => (p.minAge > 0 ? `${p.minAge}` : "Any") },
  { label: "Minimum income", value: (p) => (p.minIncome > 0 ? `${eur(p.minIncome)} / year` : "None") },
  { label: "Best for", value: (p) => p.personas.map((x) => PERSONA_LABEL[x]).join(", ") },
  { label: "Fees", value: (p) => p.feeSummary },
  { label: "Protection", value: (p) => p.regulatoryNote },
];

function parseSkus(raw: string | undefined): Product[] {
  const seen = new Set<string>();
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !seen.has(s) && seen.add(s))
    .map(getProduct)
    .filter((p): p is Product => !!p)
    .slice(0, MAX);
}

function suggestion(products: Product[]): Product | undefined {
  const picked = new Set(products.map((p) => p.sku));
  for (const p of products) {
    const alt = p.relatedSkus.map(getProduct).find((r) => r && !picked.has(r.sku));
    if (alt) return alt;
  }
  return PRODUCTS.filter((p) => !picked.has(p.sku)).sort((a, b) => b.popularityScore - a.popularityScore)[0];
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ skus?: string }> }) {
  const { skus } = await searchParams;
  const products = parseSkus(skus);
  const alt = products.length > 0 && products.length < MAX ? suggestion(products) : undefined;
  const href = (list: Product[]) => `/compare?skus=${list.map((p) => p.sku).join(",")}`;

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["COMPARE"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Compare</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>
            {products.length > 0 ? "Side by side" : "Compare products"}
          </h1>
          <p className="text-[#6B7280] max-w-xl text-lg">
            Pick up to three products anywhere on the site — the same numbers, the same labels, whatever the category.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto space-y-10">
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-10 text-center" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <p className="text-xl font-bold text-[#0B0D12] mb-2" style={{ letterSpacing: "-0.01em" }}>
                Nothing to compare yet
              </p>
              <p className="text-[#6B7280] mb-6">Use “+ Compare” on any product card, or start from a category.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORY_CONFIGS.map((c) => (
                  <Link
                    key={c.category}
                    href={`/products/${c.routeSlug}`}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#D8E0ED] text-[#0B0D12] hover:bg-[#F6F7FB]"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="bg-white rounded-3xl border border-[#D8E0ED] overflow-x-auto"
              style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
            >
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="align-top border-b border-[#D8E0ED]">
                    <th className="px-6 py-6 text-left text-[11px] font-bold uppercase tracking-widest text-[#6B7280] w-44">
                      Product
                    </th>
                    {products.map((p) => (
                      <th key={p.sku} className="px-4 py-6 text-left font-normal">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ color: p.accent, backgroundColor: `${p.accent}18` }}
                        >
                          {p.category}
                        </span>
                        <Link href={p.url} className="block font-bold text-[#0B0D12] text-lg mt-2 leading-snug hover:text-[#2563FF]">
                          {p.name}
                        </Link>
                        <div className="mt-1">
                          <Rating rating={p.customerRating} count={p.reviewCount} />
                        </div>
                        <div className="flex gap-3 mt-3 text-xs font-bold">
                          <Link href={CATEGORY_CONFIG[p.category].detailCta.href(p)} className="text-[#2563FF] hover:underline">
                            {CATEGORY_CONFIG[p.category].detailCta.label}
                          </Link>
                          {products.length > 1 && (
                            <Link href={href(products.filter((x) => x.sku !== p.sku))} className="text-[#6B7280] hover:underline">
                              Remove
                            </Link>
                          )}
                        </div>
                      </th>
                    ))}
                    {products.length < MAX && (
                      <th className="px-4 py-6 text-left font-normal">
                        <p className="text-xs text-[#6B7280] mb-2">Add another product</p>
                        <div className="flex flex-wrap gap-1.5">
                          {CATEGORY_CONFIGS.slice(0, 6).map((c) => (
                            <Link
                              key={c.category}
                              href={`/products/${c.routeSlug}`}
                              className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#D8E0ED] text-[#0B0D12] hover:bg-[#F6F7FB]"
                            >
                              {c.title}
                            </Link>
                          ))}
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-[#D8E0ED] last:border-0 align-top">
                      <th className="px-6 py-3.5 text-left text-[#6B7280] font-medium">{row.label}</th>
                      {products.map((p) => (
                        <td key={p.sku} className="px-4 py-3.5 text-[#1F2937]">
                          {row.value(p)}
                        </td>
                      ))}
                      {products.length < MAX && <td />}
                    </tr>
                  ))}
                  <tr className="border-b border-[#D8E0ED] align-top">
                    <th className="px-6 py-3.5 text-left text-[#6B7280] font-medium">Key features</th>
                    {products.map((p) => (
                      <td key={p.sku} className="px-4 py-3.5">
                        <ul className="space-y-1.5">
                          {p.features.map((f) => (
                            <li key={f} className="flex gap-2 text-[#1F2937]">
                              <span style={{ color: p.accent }}>✓</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {products.length < MAX && <td />}
                  </tr>
                  <tr className="align-top">
                    <th className="px-6 py-3.5 text-left text-[#6B7280] font-medium">Eligibility</th>
                    {products.map((p) => (
                      <td key={p.sku} className="px-4 py-3.5">
                        <ul className="space-y-1.5">
                          {p.eligibility.map((e) => (
                            <li key={e} className="flex gap-2 text-[#1F2937]">
                              <span className="text-[#6B7280]">—</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {products.length < MAX && <td />}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* A DY recommendation campaign can replace this with a personalised alternative */}
          {alt && (
            <div id="dy-compare-suggestion" className="bg-[#E7EEFF] border border-[#2563FF]/20 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-1">You might also compare</p>
                <p className="text-[#0B0D12] font-bold text-lg" style={{ letterSpacing: "-0.01em" }}>
                  {alt.name} <span className="text-[#6B7280] font-normal text-sm">· {alt.displayPrice}</span>
                </p>
              </div>
              <Link
                href={href([...products, alt])}
                className="bg-[#0B0D12] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1A1F2C] transition-colors"
              >
                Add to comparison
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
