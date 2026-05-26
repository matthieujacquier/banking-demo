"use client";

import { useDY, useDYPageview } from "@/lib/dy-client";
import { HOLDINGS, formatEUR, portfolioValue } from "@/lib/app-data";
import { getProduct, productsByCategory } from "@/lib/products";
import { useSheet } from "@/lib/app-sheet";
import AdvisorPromptModal from "@/components/app/AdvisorPromptModal";
import ProductCard from "@/components/app/ProductCard";

const TOP_UP = 250;

export default function InvestmentsPage() {
  useDYPageview("OTHER", ["INVESTMENTS"]);
  const dy = useDY();
  const { open } = useSheet();

  const total = portfolioValue();
  const weightedChange =
    HOLDINGS.reduce((s, h) => s + h.value * h.changePct, 0) / total;

  return (
    <div className="px-5 py-6 space-y-6">
      <AdvisorPromptModal />
      <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
        Investments
      </h1>

      {/* Portfolio summary */}
      <div
        className="rounded-3xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)" }}
      >
        <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1">
          Portfolio value
        </p>
        <p className="text-3xl font-bold" style={{ letterSpacing: "-0.02em" }}>
          {formatEUR(total)}
        </p>
        <p className="text-sm font-semibold mt-2 text-[#C4B5FD]">
          {weightedChange >= 0 ? "▲" : "▼"} {Math.abs(weightedChange).toFixed(1)}% this month
        </p>
      </div>

      {/* Holdings */}
      <div>
        <h2 className="font-bold text-[#0B0D12] mb-3" style={{ letterSpacing: "-0.01em" }}>
          Your holdings
        </h2>
        <div className="space-y-3">
          {HOLDINGS.map((holding) => {
            const product = getProduct(holding.sku);
            const up = holding.changePct >= 0;
            return (
              <div
                key={holding.sku}
                className="bg-white rounded-2xl border border-[#D8E0ED] p-4"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => product && open(product)}
                    className="text-left min-w-0"
                  >
                    <p className="text-sm font-bold text-[#0B0D12]">{holding.name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{holding.detail}</p>
                  </button>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#0B0D12]">
                      {formatEUR(holding.value)}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        up ? "text-[#119E5A]" : "text-[#D14343]"
                      }`}
                    >
                      {up ? "+" : ""}
                      {holding.changePct}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => product && dy.purchase(product, TOP_UP)}
                  className="mt-3 w-full bg-[#F6F7FB] border border-[#D8E0ED] text-[#0B0D12] py-2 rounded-full text-xs font-bold hover:bg-[#E7EEFF] transition-colors"
                >
                  Invest {formatEUR(TOP_UP)} more
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-[#6B7280] text-center mt-2">
          &quot;Invest more&quot; fires a <span className="font-semibold">Purchase</span> event
        </p>
      </div>

      {/* Explore */}
      <div>
        <h2 className="font-bold text-[#0B0D12] mb-3" style={{ letterSpacing: "-0.01em" }}>
          Explore investments
        </h2>
        <div className="space-y-3">
          {productsByCategory("Investments").map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
