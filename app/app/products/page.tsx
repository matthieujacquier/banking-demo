"use client";

import { useState } from "react";
import { useDY, useDYPageview } from "@/lib/dy-client";
import { CATEGORIES, PRODUCTS, type ProductCategory } from "@/lib/products";
import ProductCard from "@/components/app/ProductCard";
import RecommendationStrip from "@/components/app/RecommendationStrip";

const PRODUCTS_FALLBACK = ["LOAN-STU-001", "CRYPTO-PORT-001", "SAV-INST-001"];

type Filter = ProductCategory | "All";

const SERVICES: { label: string; accent: string; category?: ProductCategory }[] = [
  { label: "Insurance", accent: "#EA580C", category: "Insurance" },
  { label: "Private Banking", accent: "#B45309", category: "Private Banking" },
  { label: "Transfers", accent: "#2563FF" },
  { label: "Support", accent: "#64748B" },
];

export default function ProductsPage() {
  useDYPageview("CATEGORY", ["PRODUCTS"]);
  const dy = useDY();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const visible = PRODUCTS.filter((p) => {
    const matchesCategory = filter === "All" || p.category === filter;
    const matchesQuery =
      submitted === "" ||
      `${p.name} ${p.description} ${p.subcategory} ${p.category}`
        .toLowerCase()
        .includes(submitted.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="px-5 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
        Products &amp; Services
      </h1>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = query.trim();
          setSubmitted(q);
          if (q) dy.keywordSearch(q);
        }}
      >
        <div className="flex items-center gap-2 bg-[#F6F7FB] border border-[#D8E0ED] rounded-2xl px-4 py-2.5">
          <span className="text-[#6B7280]">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-sm text-[#1F2937] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSubmitted("");
              }}
              className="text-[#6B7280] text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Recommendations */}
      <RecommendationStrip
        selector="App Products Recommendations"
        pageType="CATEGORY"
        fallbackSkus={PRODUCTS_FALLBACK}
      />

      {/* Services */}
      <div>
        <h2 className="font-bold text-[#0B0D12] mb-3" style={{ letterSpacing: "-0.01em" }}>
          Banking services
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {SERVICES.map((service) => (
            <button
              key={service.label}
              onClick={() => service.category && setFilter(service.category)}
              className="bg-white border border-[#D8E0ED] rounded-2xl p-3.5 text-left flex items-center gap-3 hover:border-[#2563FF]/40 transition-colors"
            >
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ background: service.accent }}
              >
                {service.label.charAt(0)}
              </span>
              <span className="text-sm font-semibold text-[#0B0D12]">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
        {(["All", ...CATEGORIES] as Filter[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === cat
                ? "bg-[#0B0D12] text-white border-[#0B0D12]"
                : "bg-white text-[#6B7280] border-[#D8E0ED] hover:border-[#2563FF]/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Catalog */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">
          {visible.length} product{visible.length === 1 ? "" : "s"}
          {submitted && ` · “${submitted}”`}
        </p>
        {visible.length === 0 ? (
          <p className="text-[#6B7280] text-sm py-8 text-center">
            No products match your search.
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
