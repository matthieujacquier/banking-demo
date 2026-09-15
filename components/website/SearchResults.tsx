"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/website/ProductCard";
import SearchMuseHandoff from "@/components/website/SearchMuseHandoff";
import { CATEGORIES, getProduct, type Product } from "@/lib/products";
import { CATEGORY_CONFIGS, PERSONA_LABEL, GOAL_LABEL } from "@/lib/catalog-config";
import { dySearch, dyReportSlotClick, dyEvent, dyTrack, type SearchResponse } from "@/lib/dy-public";
import type { Facet, SearchFilter } from "@/lib/search-local";
import type { Goal, Persona } from "@/lib/products";

const PAGE_SIZE = 24;

const SORTS: { id: string; label: string; sortBy?: { field: string; order: "asc" | "desc" } }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "popular", label: "Most popular", sortBy: { field: "type:number:popularity_score", order: "desc" } },
  { id: "price-asc", label: "Annual cost: low to high", sortBy: { field: "price", order: "asc" } },
  { id: "risk-asc", label: "Lowest risk first", sortBy: { field: "type:number:risk_level", order: "asc" } },
  { id: "aer-desc", label: "Highest interest earned", sortBy: { field: "type:number:aer", order: "desc" } },
];

function facetValueLabel(column: string, name: string): string {
  if (column === "type:array:personas") return PERSONA_LABEL[name as Persona] ?? name;
  if (column === "type:array:goals") return GOAL_LABEL[name as Goal] ?? name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// DY's `categories` facet lists every level of the category path in lower
// case ("cards", "travel", "nexanomad"…); keep the top-level categories only,
// with their canonical names, so the rail reads like the site's navigation.
function normalizeFacets(facets: Facet[]): Facet[] {
  return facets.map((f) => {
    if (f.column !== "categories" || f.valuesType !== "string") return f;
    const byLower = new Map(CATEGORIES.map((c) => [c.toLowerCase(), c]));
    const values = f.values.flatMap((v) => {
      const canonical = byLower.get(v.name.toLowerCase());
      return canonical ? [{ name: canonical, count: v.count }] : [];
    });
    return { ...f, values };
  });
}

type Selected = Record<string, string[]>;

export default function SearchResults({ initialQuery }: { initialQuery: string }) {
  const [selected, setSelected] = useState<Selected>({});
  const [sortId, setSortId] = useState("relevance");
  const [page, setPage] = useState(0);
  // The latest response, tagged with the request it answers; "loading" is
  // simply "the answer on screen is not for the current request".
  const [answer, setAnswer] = useState<{ key: string; res: SearchResponse | null } | null>(null);
  const [facets, setFacets] = useState<Facet[]>([]);

  const filters = useMemo<SearchFilter[]>(
    () =>
      Object.entries(selected)
        .filter(([, values]) => values.length > 0)
        .map(([field, values]) => ({ field, values })),
    [selected],
  );
  const requestKey = JSON.stringify({ q: initialQuery, filters, sortId, page });
  const loading = answer?.key !== requestKey;
  const result = answer?.res ?? null;

  useEffect(() => {
    let cancelled = false;
    dySearch({
      text: initialQuery,
      filters,
      pagination: { numItems: PAGE_SIZE, offset: page * PAGE_SIZE },
      sortBy: SORTS.find((s) => s.id === sortId)?.sortBy,
    }).then((res) => {
      if (cancelled) return;
      setAnswer({ key: requestKey, res });
      // Keep the facet rail stable while the user narrows down: only replace
      // it when there are no active filters.
      if (res && filters.length === 0) setFacets(normalizeFacets(res.data.facets ?? []));
    });
    return () => {
      cancelled = true;
    };
  }, [initialQuery, filters, sortId, page, requestKey]);

  // DY's Keyword Search event: once per query — not again when the visitor
  // narrows with a facet, re-sorts or pages through the same search.
  useEffect(() => {
    const keywords = initialQuery.trim();
    if (!keywords) return;
    dyTrack("Keyword Search", { dyType: "keyword-search-v1", keywords });
  }, [initialQuery]);

  const items = useMemo(
    () =>
      (result?.data.slots ?? [])
        .map((slot) => ({ slot, product: getProduct(slot.sku) }))
        .filter((x): x is { slot: { slotId: string; sku: string }; product: Product } => !!x.product),
    [result],
  );

  const total = result?.data.totalNumResults ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const corrected =
    result?.data.spellCheckedQuery && result.data.spellCheckedQuery !== result.data.normalizedQuery
      ? result.data.spellCheckedQuery
      : null;

  function toggle(column: string, value: string) {
    setPage(0);
    setSelected((prev) => {
      const current = prev[column] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [column]: next };
    });
  }

  function onResultClick(slotId: string, sku: string) {
    dyReportSlotClick(slotId);
    dyEvent("Search Result Click", {
      sku,
      query: initialQuery,
      source: result?._source ?? "local",
      ...(result?.decisionId ? { decisionId: result.decisionId } : {}),
    });
  }

  const stringFacets = facets.filter((f): f is Extract<Facet, { valuesType: "string" }> => f.valuesType === "string");

  return (
    <section className="py-12 px-6 bg-[#F6F7FB] flex-1">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[260px_1fr] gap-10">
        {/* Facet rail */}
        <aside className="space-y-7">
          {stringFacets.map((f) => (
            <div key={f.column}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">{f.displayName}</p>
              <div className="flex flex-wrap gap-2">
                {f.values.slice(0, 10).map((v) => {
                  const on = (selected[f.column] ?? []).includes(v.name);
                  return (
                    <button
                      key={v.name}
                      onClick={() => toggle(f.column, v.name)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                        on
                          ? "bg-[#0B0D12] text-white border-[#0B0D12]"
                          : "bg-white text-[#1F2937] border-[#D8E0ED] hover:border-[#2563FF]/50"
                      }`}
                    >
                      {facetValueLabel(f.column, v.name)}
                      <span className={`ml-1.5 ${on ? "text-white/60" : "text-[#9CA3AF]"}`}>{v.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {filters.length > 0 && (
            <button
              onClick={() => {
                setSelected({});
                setPage(0);
              }}
              className="text-xs font-bold text-[#2563FF] hover:underline"
            >
              Clear filters
            </button>
          )}
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                {loading ? "Searching…" : `${total} result${total === 1 ? "" : "s"}`}
                {initialQuery && !loading && (
                  <>
                    {" "}
                    for <span className="text-[#0B0D12]">“{corrected ?? initialQuery}”</span>
                  </>
                )}
              </p>
              {corrected && (
                <p className="text-sm text-[#6B7280] mt-1">
                  Showing results for <strong className="text-[#0B0D12]">{corrected}</strong> — you searched for “
                  {initialQuery}”.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {result && (
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                  style={
                    result._source === "dy"
                      ? { color: "#2563FF", borderColor: "#2563FF40", background: "#2563FF10" }
                      : { color: "#B7791F", borderColor: "#B7791F40", background: "#B7791F10" }
                  }
                  title={
                    result._source === "dy"
                      ? "Results served by Dynamic Yield Experience Search"
                      : "DY Semantic Search campaign not live yet — served by the local fallback"
                  }
                >
                  {result._source === "dy" ? "Dynamic Yield" : "Local fallback"}
                </span>
              )}
              <select
                value={sortId}
                onChange={(e) => {
                  setSortId(e.target.value);
                  setPage(0);
                }}
                aria-label="Sort results"
                className="text-sm bg-white border border-[#D8E0ED] rounded-full px-4 py-2 text-[#1F2937] focus:outline-none focus:border-[#2563FF]"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && items.length === 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-3xl bg-white border border-[#D8E0ED] animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-10 text-center">
              <p className="text-xl font-bold text-[#0B0D12] mb-2" style={{ letterSpacing: "-0.01em" }}>
                No products match “{initialQuery}”
              </p>
              <p className="text-[#6B7280] mb-6">Try a different wording, or browse a category.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORY_CONFIGS.map((c) => (
                  <Link
                    key={c.category}
                    href={`/products/${c.routeSlug}`}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#D8E0ED] text-[#0B0D12] hover:bg-[#F6F7FB]"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div id="dy-search-results" className={`grid md:grid-cols-2 xl:grid-cols-3 gap-6 ${loading ? "opacity-60" : ""}`}>
              {items.map(({ slot, product }) => (
                <div key={slot.slotId + product.sku} onClickCapture={() => onResultClick(slot.slotId, product.sku)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-full border border-[#D8E0ED] text-sm font-bold text-[#0B0D12] disabled:opacity-40 hover:bg-white"
              >
                ← Previous
              </button>
              <span className="text-sm text-[#6B7280]">
                Page {page + 1} of {pages}
              </span>
              <button
                disabled={page >= pages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-full border border-[#D8E0ED] text-sm font-bold text-[#0B0D12] disabled:opacity-40 hover:bg-white"
              >
                Next →
              </button>
            </div>
          )}

          {initialQuery.trim() && result && <SearchMuseHandoff key={initialQuery} query={initialQuery} total={total} />}
        </div>
      </div>
    </section>
  );
}
