"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearCompare, compareHref, useCompare, COMPARE_MAX } from "@/lib/compare";
import { dyTrack } from "@/lib/dy-public";
import { getProduct } from "@/lib/products";

// Floating tray showing the products picked for comparison.
export default function CompareBar() {
  const skus = useCompare();
  const pathname = usePathname();
  if (skus.length === 0 || pathname?.startsWith("/app") || pathname === "/compare") return null;
  const names = skus.map((s) => getProduct(s)?.shortName ?? getProduct(s)?.name ?? s);

  return (
    <div className="fixed bottom-5 right-5 z-[55] flex items-center gap-3 rounded-full bg-white border border-[#D8E0ED] pl-4 pr-2 py-2 shadow-[0_16px_34px_rgba(11,13,18,0.18)] max-w-[calc(100vw-2.5rem)]">
      <span className="text-xs text-[#6B7280] truncate">
        <span className="font-bold text-[#0B0D12]">
          Compare ({skus.length}/{COMPARE_MAX})
        </span>{" "}
        · {names.join(" · ")}
      </span>
      <Link
        href={compareHref(skus)}
        onClick={() =>
          dyTrack("Compare Opened", {
            compareCount: skus.length,
            compareSkus: skus.join(","),
            productNames: names.join(", "),
            categories: [...new Set(skus.map((s) => getProduct(s)?.category).filter(Boolean))].join(","),
            page: window.location.pathname,
          })
        }
        className="shrink-0 bg-[#0B0D12] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#1A1F2C] transition-colors"
      >
        Compare →
      </Link>
      <button
        type="button"
        onClick={clearCompare}
        aria-label="Clear comparison"
        className="shrink-0 w-8 h-8 rounded-full text-[#6B7280] hover:bg-[#F6F7FB]"
      >
        ✕
      </button>
    </div>
  );
}
