"use client";

import { useEffect, useRef, useState } from "react";
import { useDY } from "@/lib/dy-client";
import { useSheet } from "@/lib/app-sheet";
import { CATEGORY_ACCENT, getProduct, type Product } from "@/lib/products";

interface RecItem {
  product: Product;
  slotId?: string;
}

interface ChooseSlot {
  slotId?: string;
  sku?: string;
}

interface ChooseChoice {
  type?: string;
  decisionId?: string;
  variations?: { payload?: { data?: { slots?: ChooseSlot[] } } }[];
}

function extractRecs(
  res: unknown,
): { decisionId?: string; slots: ChooseSlot[] } | null {
  const choices = (res as { choices?: ChooseChoice[] })?.choices;
  if (!Array.isArray(choices)) return null;
  for (const choice of choices) {
    if (choice.type === "RECS_DECISION" || choice.type === "SORT_DECISION") {
      const slots = choice.variations?.[0]?.payload?.data?.slots;
      if (Array.isArray(slots) && slots.length) {
        return { decisionId: choice.decisionId, slots };
      }
    }
  }
  return null;
}

export default function RecommendationStrip({
  selector,
  pageType,
  fallbackSkus,
}: {
  selector: string;
  pageType: string;
  fallbackSkus: string[];
}) {
  const dy = useDY();
  const { open } = useSheet();
  const [items, setItems] = useState<RecItem[]>([]);
  const [live, setLive] = useState(false);
  const decisionId = useRef<string | undefined>(undefined);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const res = await dy.choose([selector], { type: pageType });
      const recs = extractRecs(res);
      if (recs) {
        decisionId.current = recs.decisionId;
        const mapped = recs.slots
          .map((s): RecItem | null => {
            const product = s.sku ? getProduct(s.sku) : undefined;
            return product ? { product, slotId: s.slotId } : null;
          })
          .filter((x): x is RecItem => x !== null);
        if (mapped.length) {
          setItems(mapped);
          setLive(true);
          dy.reportEngagement("SLOT_IMP", { decisionId: recs.decisionId });
          return;
        }
      }
      // No campaign / no decision — fall back to a hard-coded selection.
      setItems(
        fallbackSkus
          .map((sku) => getProduct(sku))
          .filter((p): p is Product => p !== undefined)
          .map((product) => ({ product })),
      );
    })();
  }, [dy, selector, pageType, fallbackSkus]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
          Recommended for you
        </h2>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            color: live ? "#16A34A" : "#6B7280",
            background: live ? "#16A34A18" : "#F6F7FB",
          }}
        >
          {live ? "DY live" : "Fallback"}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1">
        {items.map(({ product, slotId }) => {
          const accent = CATEGORY_ACCENT[product.category];
          return (
            <button
              key={product.sku + (slotId ?? "")}
              onClick={() => {
                if (slotId) {
                  dy.reportEngagement("SLOT_CLICK", {
                    decisionId: decisionId.current,
                    slotId,
                  });
                }
                open(product);
              }}
              className="flex-shrink-0 w-44 text-left bg-white rounded-2xl border border-[#D8E0ED] p-4 hover:border-[#2563FF]/40 transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center text-white text-sm font-bold"
                style={{ background: accent }}
              >
                {product.category.charAt(0)}
              </div>
              <p className="font-bold text-[#0B0D12] text-sm leading-tight">
                {product.name}
              </p>
              <p className="text-[#6B7280] text-xs mt-1">{product.displayPrice}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
