"use client";

import { CATEGORY_ACCENT, type Product } from "@/lib/products";
import { useSheet } from "@/lib/app-sheet";

export default function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect?: (product: Product) => void;
}) {
  const { open } = useSheet();
  const accent = CATEGORY_ACCENT[product.category];

  return (
    <button
      onClick={() => {
        onSelect?.(product);
        open(product);
      }}
      className="w-full text-left bg-white rounded-2xl border border-[#D8E0ED] p-4 flex flex-col gap-2 hover:border-[#2563FF]/40 transition-colors"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ color: accent, background: `${accent}18` }}
        >
          {product.subcategory}
        </span>
        <span className="text-xs font-bold whitespace-nowrap" style={{ color: accent }}>
          {product.displayPrice}
        </span>
      </div>
      <p className="font-bold text-[#0B0D12] text-sm" style={{ letterSpacing: "-0.01em" }}>
        {product.name}
      </p>
      <p className="text-[#6B7280] text-xs leading-relaxed line-clamp-2">{product.description}</p>
    </button>
  );
}
