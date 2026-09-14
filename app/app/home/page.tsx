"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDY, useDYPageview } from "@/lib/dy-client";
import { DY_SELECTORS } from "@/lib/dy-config";
import { useMuse } from "@/lib/app-muse";
import { loadProfile } from "@/lib/profile";
import { recommendForProfile } from "@/lib/recommend-local";
import { getProduct, type Product } from "@/lib/products";
import { DEFAULT_USER, readSessionUser } from "@/lib/session-user";
import {
  ADVANTAGES,
  CARD,
  HOLDINGS,
  MONTH_EXPENSES,
  MONTH_INCOME,
  TRANSACTIONS,
  formatEUR,
  totalBalance,
} from "@/lib/app-data";
import TransactionRow from "@/components/app/TransactionRow";
import ProductCard from "@/components/app/ProductCard";

const QUICK_ACTIONS = [
  { label: "Send", icon: "↑" },
  { label: "Request", icon: "↓" },
  { label: "Pay", icon: "⊕" },
  { label: "Top up", icon: "+" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

interface RecsSlot {
  sku: string;
  slotId?: string;
}

interface RecsState {
  source: "dy" | "local";
  decisionId?: string;
  slots: RecsSlot[];
}

// DY RECS_DECISION → variations[0].payload { type: "RECS", data: { slots: [{ sku, slotId }] } }
function extractRecs(res: unknown): { decisionId?: string; slots: RecsSlot[] } | null {
  const choices = (res as { choices?: Record<string, unknown>[] } | null)?.choices;
  if (!Array.isArray(choices)) return null;
  for (const c of choices) {
    if (c.name !== DY_SELECTORS.homeRecs || c.type !== "RECS_DECISION") continue;
    const variations = c.variations as { payload?: { type?: string; data?: { slots?: RecsSlot[] } } }[] | undefined;
    const payload = variations?.[0]?.payload;
    if (payload?.type === "RECS" && Array.isArray(payload.data?.slots)) {
      return { decisionId: c.decisionId as string | undefined, slots: payload.data.slots };
    }
  }
  return null;
}

export default function HomePage() {
  useDYPageview("HOMEPAGE", ["HOME"]);
  const dy = useDY();
  const { open: openMuse } = useMuse();
  const [name] = useState(() => (readSessionUser() ?? DEFAULT_USER).name.split(" ")[0] || "there");
  const [recs, setRecs] = useState<RecsState | null>(null);
  const advantagesTotal = ADVANTAGES.reduce((s, a) => s + a.earned, 0);

  // "For you": the DY App Home Recommendations campaign, or — until it is
  // live — a local pick from the declared financial profile.
  useEffect(() => {
    let cancelled = false;
    dy.choose([DY_SELECTORS.homeRecs], { type: "HOMEPAGE", data: ["HOME"] }).then((res) => {
      if (cancelled) return;
      const decision = extractRecs(res);
      if (decision && decision.slots.length > 0) {
        setRecs({ source: "dy", decisionId: decision.decisionId, slots: decision.slots });
        if (decision.decisionId) dy.reportEngagement("IMP", { decisionId: decision.decisionId });
      } else {
        const held = [...HOLDINGS.map((h) => h.sku), CARD.sku, "SAV-INST-001", "ACC-EVERY-001"];
        setRecs({ source: "local", slots: recommendForProfile(loadProfile(), held, 3).map((p) => ({ sku: p.sku })) });
      }
    });
    return () => {
      cancelled = true;
    };
    // dy is a stable memoised object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recProducts = (recs?.slots ?? [])
    .map((s) => ({ slot: s, product: getProduct(s.sku) }))
    .filter((x): x is { slot: RecsSlot; product: Product } => !!x.product);

  function onRecSelect(product: Product) {
    if (!recs) return;
    const slot = recs.slots.find((s) => s.sku === product.sku);
    if (recs.source === "dy") {
      if (slot?.slotId) dy.reportEngagement("SLOT_CLICK", { slotId: slot.slotId });
      else if (recs.decisionId) dy.reportEngagement("CLICK", { decisionId: recs.decisionId });
    }
    dy.event("Home Recommendation Click", "Home Recommendation Click", { sku: product.sku, source: recs.source });
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <p className="text-[#6B7280] text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
          {name}
        </h1>
      </div>

      {/* Balance hero */}
      <div className="bg-[#0B0D12] rounded-3xl p-5 text-white">
        <p className="text-white/45 text-xs font-bold uppercase tracking-widest mb-1">
          Total balance
        </p>
        <p className="text-3xl font-bold mb-5" style={{ letterSpacing: "-0.02em" }}>
          {formatEUR(totalBalance())}
        </p>
        <div className="flex justify-between text-xs">
          <div>
            <p className="text-white/45 uppercase tracking-widest font-bold mb-0.5">Income</p>
            <p className="font-semibold text-[#4ADE80]">+{formatEUR(MONTH_INCOME)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/45 uppercase tracking-widest font-bold mb-0.5">Spent</p>
            <p className="font-semibold text-white">-{formatEUR(MONTH_EXPENSES)}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button key={action.label} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#F6F7FB] flex items-center justify-center text-[#0B0D12] font-bold text-lg border border-[#D8E0ED]">
              {action.icon}
            </div>
            <span className="text-[11px] text-[#6B7280] font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Ask Muse */}
      <button
        onClick={() => openMuse()}
        className="w-full text-left bg-[#0B0D12] rounded-2xl p-4 flex items-center gap-3 text-white hover:bg-[#1A1F2C] transition-colors"
      >
        <span className="w-10 h-10 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center text-lg">✦</span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold">Ask Muse</span>
          <span className="block text-xs text-white/55">“What should I do with the €8,200 in savings?”</span>
        </span>
        <span className="text-white/60">→</span>
      </button>

      {/* For you — DY recommendations slot */}
      <div id="dy-app-home-recs">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
            For you
          </h2>
          {recs && (
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={
                recs.source === "dy"
                  ? { color: "#2563FF", borderColor: "#2563FF40" }
                  : { color: "#B7791F", borderColor: "#B7791F40" }
              }
              title={
                recs.source === "dy"
                  ? "Served by the DY “App Home Recommendations” campaign"
                  : "No DY recommendations campaign yet — picked locally from your financial profile"
              }
            >
              {recs.source === "dy" ? "DY recs" : "Local"}
            </span>
          )}
        </div>
        {recs === null ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#F6F7FB] border border-[#D8E0ED] animate-pulse" />
            ))}
          </div>
        ) : recProducts.length === 0 ? (
          <p className="text-[#6B7280] text-sm">Set your financial profile to get suggestions.</p>
        ) : (
          <div className="space-y-3">
            {recProducts.map(({ product }) => (
              <ProductCard key={product.sku} product={product} onSelect={onRecSelect} />
            ))}
          </div>
        )}
        <Link href="/app/profile" className="block text-xs text-[#2563FF] font-bold mt-3">
          Update your financial profile →
        </Link>
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
            Recent activity
          </h2>
          <Link href="/app/accounts" className="text-xs text-[#2563FF] font-bold">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {TRANSACTIONS.slice(0, 4).map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      </div>

      {/* Offers */}
      <Link href="/app/offers" className="block bg-[#FFF7E6] border border-[#F5D08A] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0B0D12]">Offers for you</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Personalised offers, chosen by Dynamic Yield</p>
          </div>
          <span className="text-[#B7791F] font-bold">→</span>
        </div>
      </Link>

      {/* Advantages snapshot */}
      <Link
        href="/app/advantages"
        className="block bg-[#E7EEFF] border border-[#2563FF]/20 rounded-2xl p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0B0D12]">My advantages</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {formatEUR(advantagesTotal)} earned in rewards & cashback
            </p>
          </div>
          <span className="text-[#2563FF] font-bold">→</span>
        </div>
      </Link>
    </div>
  );
}
