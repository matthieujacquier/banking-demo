import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import { CATEGORIES, PRODUCTS, productsByCategory, type Product, type ProductCategory } from "@/lib/products";
import { CATEGORY_CONFIG, termLabel } from "@/lib/catalog-config";
import { eur } from "@/lib/money";

// Rates & fees — every product's comparable numbers in one place, straight
// from the same model that generates the DY feed.

type ColumnKey =
  | "headline"
  | "annualCost"
  | "monthlyFee"
  | "apr"
  | "aer"
  | "target"
  | "ongoing"
  | "perTxn"
  | "fx"
  | "cashback"
  | "cap"
  | "min"
  | "max"
  | "term"
  | "notice"
  | "risk"
  | "rating";

const LABEL: Record<ColumnKey, string> = {
  headline: "Headline",
  annualCost: "Annual cost",
  monthlyFee: "Monthly fee",
  apr: "APR (you pay)",
  aer: "AER (you earn)",
  target: "Target return",
  ongoing: "Ongoing charge",
  perTxn: "Per transaction",
  fx: "FX markup",
  cashback: "Cashback",
  cap: "Cashback cap",
  min: "Minimum",
  max: "Maximum",
  term: "Term",
  notice: "Notice",
  risk: "Risk",
  rating: "Rating",
};

const COLUMNS: Record<ProductCategory, ColumnKey[]> = {
  Accounts: ["headline", "monthlyFee", "aer", "fx", "max", "risk", "rating"],
  Cards: ["headline", "annualCost", "apr", "cashback", "fx", "max", "rating"],
  Loans: ["headline", "apr", "min", "max", "term", "rating"],
  Savings: ["headline", "aer", "min", "max", "notice", "term", "risk"],
  Investments: ["headline", "target", "ongoing", "min", "term", "risk", "rating"],
  Insurance: ["headline", "monthlyFee", "annualCost", "max", "term", "rating"],
  Crypto: ["headline", "perTxn", "ongoing", "aer", "min", "max", "risk"],
  Cashback: ["headline", "annualCost", "cashback", "cap", "apr", "rating"],
  Business: ["headline", "monthlyFee", "apr", "aer", "perTxn", "fx", "min", "max"],
  "Private Banking": ["headline", "ongoing", "apr", "min", "max", "risk"],
  Services: ["headline", "annualCost", "fx", "rating"],
};

const dash = "—";

function cell(p: Product, key: ColumnKey): string {
  switch (key) {
    case "headline":
      return p.displayPrice;
    case "annualCost":
      return p.price > 0 ? `${eur(p.price)} / yr` : "Free";
    case "monthlyFee":
      return p.monthlyFee > 0 ? `${eur(p.monthlyFee)} / mo` : p.category === "Accounts" || p.category === "Business" ? "€0" : dash;
    case "apr":
      return p.interestRate > 0 ? `from ${p.interestRate}%` : dash;
    case "aer":
      return p.aer > 0 ? `${p.aer}%` : dash;
    case "target":
      return p.expectedReturnMax > 0 ? `${p.expectedReturnMin}–${p.expectedReturnMax}% p.a.` : "Market-linked";
    case "ongoing":
      return p.annualFeePct > 0 ? `${p.annualFeePct}% / yr` : dash;
    case "perTxn":
      return p.transactionFeePct > 0 ? `${p.transactionFeePct}%` : dash;
    case "fx":
      return `${p.fxFeePct}%`;
    case "cashback":
      return p.cashbackPercent > 0 ? `up to ${p.cashbackPercent}%` : dash;
    case "cap":
      return p.cashbackMonthlyCap > 0 ? `${eur(p.cashbackMonthlyCap)} / mo` : "No cap";
    case "min":
      return p.minAmount > 0 ? eur(p.minAmount) + (p.contributionPeriod ? " / mo" : "") : "None";
    case "max":
      return p.maxAmount > 0 ? eur(p.maxAmount) : "No cap";
    case "term":
      return p.termMonths > 0 ? termLabel(p) : p.minTermMonths > 0 ? `Min. ${p.minTermMonths} months` : "Open-ended";
    case "notice":
      return p.noticeDays > 0 ? `${p.noticeDays} days` : "Instant";
    case "risk":
      return `${p.riskLevel}/10`;
    case "rating":
      return `★ ${p.customerRating.toFixed(1)}`;
  }
}

export default function RatesPage() {
  const bestAer = Math.max(...PRODUCTS.filter((p) => p.category === "Savings").map((p) => p.aer));
  const lowestApr = Math.min(...PRODUCTS.filter((p) => p.category === "Loans").map((p) => p.interestRate));
  const bestCashback = Math.max(...PRODUCTS.filter((p) => p.category === "Cards" || p.category === "Cashback").map((p) => p.cashbackPercent));

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["RATES"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Transparency</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>
            Rates &amp; fees
          </h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">
            Every rate, fee and limit for every product, on one page. No footnotes, no &ldquo;from&rdquo; that means
            something else — the same numbers power our search and Shopping Muse.
          </p>
          <div className="flex flex-wrap gap-10">
            {[
              [`${bestAer}% AER`, "Best savings rate"],
              [`from ${lowestApr}% APR`, "Lowest loan rate"],
              [`up to ${bestCashback}%`, "Highest cashback"],
              ["0%", "FX on account card payments"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  {value}
                </p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* DY can personalise this promo — e.g. the rate that matters for the visitor's affinity */}
          <div
            id="dy-rates-promo"
            className="bg-[#E7EEFF] border border-[#2563FF]/20 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-1">Rate of the month</p>
              <p className="text-[#0B0D12] font-bold text-lg" style={{ letterSpacing: "-0.01em" }}>
                Lock in {bestAer}% AER for 24 months with a Term Deposit
              </p>
            </div>
            <Link
              href="/products/savings/term-deposit"
              className="bg-[#0B0D12] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1A1F2C] transition-colors"
            >
              See the Term Deposit
            </Link>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Jump to category">
            {CATEGORIES.map((c) => (
              <a
                key={c}
                href={`#rates-${CATEGORY_CONFIG[c].routeSlug}`}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white border border-[#D8E0ED] text-[#0B0D12] hover:border-[#2563FF]/50"
              >
                {CATEGORY_CONFIG[c].title}
              </a>
            ))}
          </nav>

          {CATEGORIES.map((category) => {
            const cfg = CATEGORY_CONFIG[category];
            const products = productsByCategory(category);
            const columns = COLUMNS[category];
            return (
              <div key={category} id={`rates-${cfg.routeSlug}`} className="scroll-mt-24">
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
                    {cfg.title}
                  </h2>
                  <Link href={`/products/${cfg.routeSlug}`} className="text-xs font-bold text-[#2563FF] hover:underline">
                    All {cfg.title.toLowerCase()} →
                  </Link>
                </div>
                <div
                  className="bg-white rounded-3xl border border-[#D8E0ED] overflow-x-auto"
                  style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
                >
                  <table className="w-full text-sm min-w-[720px]">
                    <thead>
                      <tr className="text-left text-[11px] font-bold uppercase tracking-widest text-[#6B7280] border-b border-[#D8E0ED]">
                        <th className="px-6 py-4 font-bold">Product</th>
                        {columns.map((k) => (
                          <th key={k} className="px-4 py-4 font-bold whitespace-nowrap">
                            {LABEL[k]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.sku} className="border-b border-[#D8E0ED] last:border-0 hover:bg-[#F6F7FB]">
                          <td className="px-6 py-3.5">
                            <Link href={p.url} className="font-semibold text-[#0B0D12] hover:text-[#2563FF]">
                              {p.name}
                            </Link>
                            {p.badge && <span className="block text-[11px] text-[#6B7280]">{p.badge}</span>}
                          </td>
                          {columns.map((k) => (
                            <td key={k} className="px-4 py-3.5 text-[#1F2937] whitespace-nowrap">
                              {cell(p, k)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[#6B7280] text-xs mt-3">{cfg.disclaimer}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
