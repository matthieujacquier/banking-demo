"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDY, useDYPageview } from "@/lib/dy-client";
import { DY_SELECTORS } from "@/lib/dy-config";
import { useSheet } from "@/lib/app-sheet";
import { getProduct, CATEGORY_ACCENT } from "@/lib/products";

// Offers — a DY "App Offers" campaign (API Custom JSON) decides what to show.
// Expected variation payload:
// { "offers": [{ "title": "...", "body": "...", "sku": "CARD-NOM-001", "ctaLabel": "See the card" }] }

interface Offer {
  title: string;
  body: string;
  sku?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_OFFERS: Offer[] = [
  {
    title: "Your savings could earn 4.1% AER",
    body: "€8,200 sits in Instant Access at 3.5%. A 90-day Notice Account pays 4.1% — same protection, better rate.",
    sku: "SAV-NOT-001",
    ctaLabel: "See the Notice Account",
  },
  {
    title: "Travelling this autumn?",
    body: "Your NexaNomad already skips FX fees. Add annual travel cover for €48 a year — free on the card when you pay with it.",
    sku: "INS-TRAV-001",
    ctaLabel: "Add travel cover",
  },
  {
    title: "A free retirement check-in",
    body: "One hour with a qualified adviser to project your income at retirement. Free for NexaBank customers.",
    sku: "SVC-RETIRE-001",
    ctaLabel: "Book a consultation",
  },
];

interface OffersState {
  source: "dy" | "local";
  decisionId?: string;
  offers: Offer[];
}

function extractOffers(res: unknown): { decisionId?: string; offers: Offer[] } | null {
  const choices = (res as { choices?: Record<string, unknown>[] } | null)?.choices;
  if (!Array.isArray(choices)) return null;
  for (const c of choices) {
    if (c.name !== DY_SELECTORS.offers || c.type !== "DECISION") continue;
    const variations = c.variations as { payload?: { type?: string; data?: { offers?: Offer[] } } }[] | undefined;
    const payload = variations?.[0]?.payload;
    if (payload?.type === "CUSTOM_JSON" && Array.isArray(payload.data?.offers)) {
      return { decisionId: c.decisionId as string | undefined, offers: payload.data.offers };
    }
  }
  return null;
}

export default function OffersPage() {
  useDYPageview("OTHER", ["OFFERS"]);
  const dy = useDY();
  const { open } = useSheet();
  const [state, setState] = useState<OffersState | null>(null);

  useEffect(() => {
    let cancelled = false;
    dy.choose([DY_SELECTORS.offers], { type: "OTHER", data: ["OFFERS"] }).then((res) => {
      if (cancelled) return;
      const decision = extractOffers(res);
      if (decision && decision.offers.length > 0) {
        setState({ source: "dy", decisionId: decision.decisionId, offers: decision.offers });
        if (decision.decisionId) dy.reportEngagement("IMP", { decisionId: decision.decisionId });
      } else {
        setState({ source: "local", offers: DEFAULT_OFFERS });
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function act(offer: Offer) {
    if (state?.source === "dy" && state.decisionId) dy.reportEngagement("CLICK", { decisionId: state.decisionId });
    dy.event("Offer Click", "Offer Click", { title: offer.title, sku: offer.sku ?? null, source: state?.source ?? "local" });
    const product = offer.sku ? getProduct(offer.sku) : undefined;
    if (product) open(product);
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/app/home" className="text-[#6B7280] text-sm font-semibold">
          ← Home
        </Link>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
            Offers for you
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Chosen for your profile and activity.</p>
        </div>
        {state && (
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0"
            style={
              state.source === "dy"
                ? { color: "#2563FF", borderColor: "#2563FF40" }
                : { color: "#B7791F", borderColor: "#B7791F40" }
            }
            title={state.source === "dy" ? "Served by the DY “App Offers” campaign" : "No DY offers campaign yet — default offers"}
          >
            {state.source === "dy" ? "DY offers" : "Default"}
          </span>
        )}
      </div>

      {state === null ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#F6F7FB] border border-[#D8E0ED] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {state.offers.map((offer) => {
            const product = offer.sku ? getProduct(offer.sku) : undefined;
            const accent = product ? CATEGORY_ACCENT[product.category] : "#2563FF";
            return (
              <div
                key={offer.title}
                className="bg-white rounded-2xl border border-[#D8E0ED] p-4"
                style={{ boxShadow: "var(--shadow-soft)", borderLeft: `4px solid ${accent}` }}
              >
                <p className="font-bold text-[#0B0D12] text-sm" style={{ letterSpacing: "-0.01em" }}>
                  {offer.title}
                </p>
                <p className="text-[#6B7280] text-xs leading-relaxed mt-1">{offer.body}</p>
                {product && (
                  <p className="text-[11px] text-[#6B7280] mt-2">
                    <span className="font-semibold" style={{ color: accent }}>
                      {product.name}
                    </span>{" "}
                    · {product.displayPrice}
                  </p>
                )}
                {offer.ctaHref && !product ? (
                  <Link
                    href={offer.ctaHref}
                    onClick={() => act(offer)}
                    className="mt-3 inline-block bg-[#0B0D12] text-white px-4 py-2 rounded-full text-xs font-bold"
                  >
                    {offer.ctaLabel ?? "Learn more"}
                  </Link>
                ) : (
                  <button
                    onClick={() => act(offer)}
                    className="mt-3 bg-[#0B0D12] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#1A1F2C] transition-colors"
                  >
                    {offer.ctaLabel ?? "Learn more"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-[#6B7280] text-center leading-relaxed">
        Impressions and clicks are reported to Dynamic Yield as <span className="font-semibold">IMP</span> /{" "}
        <span className="font-semibold">CLICK</span> engagements on the decision.
      </p>
    </div>
  );
}
