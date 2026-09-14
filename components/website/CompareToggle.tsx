"use client";

import { COMPARE_MAX, toggleCompare, useCompare } from "@/lib/compare";

// "Compare" toggle on product cards and detail pages.
export default function CompareToggle({ sku, variant = "card" }: { sku: string; variant?: "card" | "detail" }) {
  const selected = useCompare();
  const on = selected.includes(sku);
  const full = !on && selected.length >= COMPARE_MAX;

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={() => toggleCompare(sku)}
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
      onClick={() => toggleCompare(sku)}
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
