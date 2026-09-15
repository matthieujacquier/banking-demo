"use client";

import { COMPARE_MAX, toggleCompare, useCompare } from "@/lib/compare";
import { dyTrack } from "@/lib/dy-public";
import { getProduct } from "@/lib/products";

// "Compare" toggle on product cards and detail pages.
export default function CompareToggle({ sku, variant = "card" }: { sku: string; variant?: "card" | "detail" }) {
  const selected = useCompare();
  const on = selected.includes(sku);
  const full = !on && selected.length >= COMPARE_MAX;

  // Comparing is the strongest pre-application signal this site has, so every
  // click reports the product, the numbers DY can build audiences on, and the
  // basket it leaves behind.
  function onToggle() {
    const next = toggleCompare(sku);
    const product = getProduct(sku);
    if (!product) return;
    dyTrack(next.includes(sku) ? "Add to Compare" : "Remove from Compare", {
      sku,
      productName: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      currency: "EUR",
      interestRate: product.interestRate,
      aer: product.aer,
      riskLevel: product.riskLevel,
      surface: variant === "detail" ? "pdp" : "listing",
      page: window.location.pathname,
      compareCount: next.length,
      compareSkus: next.join(","),
    });
  }

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={full}
        className={`block w-full text-center py-3 rounded-full font-bold text-sm border transition-colors disabled:opacity-40 ${
          on ? "bg-[#E7EEFF] border-[#2563FF]/30 text-[#2563FF]" : "border-[#D8E0ED] text-[#0B0D12] hover:bg-[#F6F7FB]"
        }`}
      >
        {on ? "✓ Added to compare" : full ? "Compare list is full" : "+ Add to compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={full}
      aria-pressed={on}
      title={full ? `You can compare up to ${COMPARE_MAX} products` : "Add to compare"}
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors disabled:opacity-40 ${
        on ? "bg-[#2563FF] text-white border-[#2563FF]" : "bg-white text-[#6B7280] border-[#D8E0ED] hover:border-[#2563FF]/50"
      }`}
    >
      {on ? "✓ Compare" : "+ Compare"}
    </button>
  );
}
