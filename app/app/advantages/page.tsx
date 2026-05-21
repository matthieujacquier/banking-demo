"use client";

import { useDYPageview } from "@/lib/dy-client";
import { ADVANTAGES, formatEUR } from "@/lib/app-data";
import { getProduct } from "@/lib/products";
import { useSheet } from "@/lib/app-sheet";

const PERKS = [
  "2 free airport lounge visits every year",
  "No foreign transaction fees worldwide",
  "Comprehensive travel & medical insurance",
  "Priority customer support line",
];

export default function AdvantagesPage() {
  useDYPageview("OTHER", ["ADVANTAGES"]);
  const { open } = useSheet();
  const total = ADVANTAGES.reduce((s, a) => s + a.earned, 0);

  return (
    <div className="px-5 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
        My advantages
      </h1>

      {/* Earned hero */}
      <div
        className="rounded-3xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #EC4899 0%, #9D174D 100%)" }}
      >
        <p className="text-white/65 text-xs font-bold uppercase tracking-widest mb-1">
          Earned this year
        </p>
        <p className="text-3xl font-bold" style={{ letterSpacing: "-0.02em" }}>
          {formatEUR(total)}
        </p>
        <p className="text-sm text-white/80 mt-2">Across rewards &amp; card cashback</p>
      </div>

      {/* Advantages */}
      <div className="space-y-3">
        {ADVANTAGES.map((advantage) => {
          const product = getProduct(advantage.sku);
          return (
            <button
              key={advantage.sku}
              onClick={() => product && open(product)}
              className="w-full text-left bg-white rounded-2xl border border-[#D8E0ED] p-4 hover:border-[#2563FF]/40 transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#0B0D12]">{advantage.title}</p>
                <p className="text-sm font-bold text-[#EC4899]">
                  {formatEUR(advantage.earned)}
                </p>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                {advantage.detail}
              </p>
            </button>
          );
        })}
      </div>

      {/* Perks */}
      <div>
        <h2 className="font-bold text-[#0B0D12] mb-3" style={{ letterSpacing: "-0.01em" }}>
          Your perks
        </h2>
        <div className="bg-[#F6F7FB] rounded-2xl border border-[#D8E0ED] p-4 space-y-2.5">
          {PERKS.map((perk) => (
            <div key={perk} className="flex gap-2.5 items-start text-sm">
              <span className="text-[#16A34A] font-bold mt-0.5">✓</span>
              <span className="text-[#1F2937]">{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
