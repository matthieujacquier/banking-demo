import Link from "next/link";
import type { Product } from "@/lib/products";
import { specRows } from "@/lib/catalog-config";

// The credit-card tile with its rendered card visual. `compact` is the
// homepage "Plans" variant (shorter visual, two stat tiles).
export default function CreditCardTile({ product, compact = false }: { product: Product; compact?: boolean }) {
  const name = product.shortName ?? product.name;
  const rows = specRows(product, "listing");
  const stats = compact
    ? [
        ["Fee / yr", rows[0]?.value ?? ""],
        ["Cashback", rows[2]?.value ?? ""],
      ]
    : rows.map((r) => [r.label, r.value]);

  return (
    <div
      id={compact && product.sku === "CARD-NOM-001" ? "dy-card-nexanomad" : undefined}
      className="bg-white rounded-3xl border border-[#D8E0ED] p-6 flex flex-col relative"
      style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
    >
      {product.badge === "Most Popular" && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2563FF] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
          Most Popular
        </div>
      )}

      {/* Card visual */}
      <div
        className={`rounded-2xl ${compact ? "h-36" : "h-40"} mb-5 relative overflow-hidden flex-shrink-0`}
        style={{ background: product.cardGradient }}
      >
        <div
          className="absolute top-4 left-4 w-8 h-6 rounded"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.12)" }}
        />
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-bold text-sm tracking-wide">{name}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            NexaBank
          </p>
        </div>
        {!compact && (
          <div className="absolute bottom-4 right-4 flex">
            <div className="w-5 h-5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
            <div className="w-5 h-5 rounded-full -ml-2" style={{ background: "rgba(255,255,255,0.12)" }} />
          </div>
        )}
      </div>

      {/* Tier badge */}
      <span
        className="self-start text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
        style={{ color: product.accent, backgroundColor: `${product.accent}18` }}
      >
        {product.subcategory}
      </span>

      <h3
        className={`font-bold text-[#0B0D12] text-xl ${compact ? "mb-1" : "mb-2"}`}
        style={{ letterSpacing: "-0.01em" }}
      >
        {name}
      </h3>
      <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">{product.cardDescription}</p>

      {/* Stats */}
      <div className={`grid ${compact ? "grid-cols-2" : "grid-cols-3"} gap-2 mb-5`}>
        {stats.map(([label, value]) => (
          <div key={label} className="bg-[#F6F7FB] rounded-xl p-2.5 text-center">
            <p className="text-[#6B7280] text-xs mb-0.5">{label}</p>
            <p className="font-bold text-[#0B0D12] text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Perks */}
      <ul className="space-y-2 mb-6 text-sm">
        {product.perks.map((p) => (
          <li key={p} className="flex gap-2 items-start">
            <span className="font-bold mt-0.5 shrink-0" style={{ color: product.accent }}>
              ✓
            </span>
            <span className="text-[#6B7280]">{p}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/signup?product=${product.sku}`}
        className={`block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors${compact ? " cursor-pointer" : ""}`}
      >
        Apply Now
      </Link>
    </div>
  );
}
