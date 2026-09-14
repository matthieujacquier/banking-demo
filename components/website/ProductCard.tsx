import Link from "next/link";
import type { Product } from "@/lib/products";
import { CATEGORY_CONFIG, specRows } from "@/lib/catalog-config";
import CompareToggle from "@/components/website/CompareToggle";
import Rating from "@/components/website/Rating";

// The standard product listing card. Credit cards use CreditCardTile instead.
export default function ProductCard({ product }: { product: Product }) {
  const cfg = CATEGORY_CONFIG[product.category];
  const rows = specRows(product, "listing");
  const perks = product.perks.slice(0, cfg.perksShown);

  return (
    <div
      className="bg-white rounded-3xl border border-[#D8E0ED] p-7 flex flex-col"
      style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)", borderTop: `3px solid ${product.accent}` }}
    >
      <div className="flex items-center justify-between mb-5">
        <span
          className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ color: product.accent, backgroundColor: `${product.accent}18` }}
        >
          {product.subcategory}
        </span>
        {product.badge && (
          <span className="text-xs font-semibold text-[#6B7280] bg-[#F6F7FB] border border-[#D8E0ED] px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      <h3 className="font-bold text-[#0B0D12] text-xl mb-2" style={{ letterSpacing: "-0.01em" }}>
        {product.name}
      </h3>
      <div className="flex items-center justify-between gap-3 mb-3">
        <Rating rating={product.customerRating} count={product.reviewCount} />
        <CompareToggle sku={product.sku} />
      </div>
      <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">{product.cardDescription}</p>

      <div className="space-y-2.5 text-sm mb-5">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between border-b border-[#D8E0ED] pb-2.5">
            <span className="text-[#6B7280]">{row.label}</span>
            <span className="font-semibold text-[#0B0D12] text-right">{row.value}</span>
          </div>
        ))}
      </div>

      {perks.length > 0 && (
        <ul className="space-y-2 mb-6 text-sm">
          {perks.map((perk) => (
            <li key={perk} className="flex gap-2 items-start">
              <span className="font-bold mt-0.5 shrink-0" style={{ color: product.accent }}>
                ✓
              </span>
              <span className="text-[#6B7280]">{perk}</span>
            </li>
          ))}
        </ul>
      )}

      {cfg.listingCtas.length > 1 ? (
        <div className="flex gap-3">
          {cfg.listingCtas.map((cta) => (
            <Link
              key={cta.label}
              href={cta.href(product)}
              className={
                cta.variant === "primary"
                  ? "flex-1 block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
                  : "flex-1 block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              }
            >
              {cta.label}
            </Link>
          ))}
        </div>
      ) : (
        cfg.listingCtas.map((cta) => (
          <Link
            key={cta.label}
            href={cta.href(product)}
            className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
          >
            {cta.label}
          </Link>
        ))
      )}
    </div>
  );
}
