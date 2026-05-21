"use client";

import { useState } from "react";
import { CATEGORY_ACCENT, type Product } from "@/lib/products";
import { useSheet } from "@/lib/app-sheet";
import { useDY } from "@/lib/dy-client";

function formatAmount(n: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function buildStats(p: Product): { label: string; value: string }[] {
  const stats: { label: string; value: string }[] = [];
  if (p.interestRate > 0) stats.push({ label: "Rate", value: `${p.interestRate}%` });
  if (p.cashbackPercent > 0)
    stats.push({ label: "Cashback", value: `${p.cashbackPercent}%` });
  if (p.annualFee > 0)
    stats.push({ label: "Annual fee", value: `${formatAmount(p.annualFee)}` });
  if (p.minAmount > 0) stats.push({ label: "From", value: formatAmount(p.minAmount) });
  if (p.maxAmount > 0) stats.push({ label: "Up to", value: formatAmount(p.maxAmount) });
  if (p.termMonths > 0)
    stats.push({ label: "Term", value: `${p.termMonths} mo` });
  return stats.slice(0, 4);
}

export default function ProductSheet({ product }: { product: Product }) {
  const { close } = useSheet();
  const dy = useDY();
  const accent = CATEGORY_ACCENT[product.category];
  const [step, setStep] = useState<"detail" | "form" | "done">("detail");
  const [profile] = useState(() => {
    const base = {
      name: "Matthieu Jacquier",
      email: "matthieu.jacquier@mastercard.com",
      phone: "+32 470 12 34 56",
    };
    try {
      const u = JSON.parse(sessionStorage.getItem("nexabank_user") ?? "{}") as {
        name?: string;
        email?: string;
      };
      return { ...base, name: u.name ?? base.name, email: u.email ?? base.email };
    } catch {
      return base;
    }
  });

  const stats = buildStats(product);

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Accent header */}
      <div className="px-5 pt-5 pb-6 text-white" style={{ background: accent }}>
        <button
          onClick={close}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white mb-4"
          aria-label="Close"
        >
          ✕
        </button>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
          {product.category} · {product.subcategory}
        </p>
        <h1 className="text-2xl font-bold mt-1" style={{ letterSpacing: "-0.02em" }}>
          {product.name}
        </h1>
        <p className="text-white/85 text-sm mt-1">{product.displayPrice}</p>
      </div>

      {step === "detail" && (
        <div className="px-5 py-6 space-y-6 flex-1">
          <p className="text-[#1F2937] text-sm leading-relaxed">{product.description}</p>

          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-[#F6F7FB] border border-[#D8E0ED] rounded-2xl p-3.5"
                >
                  <p className="text-[#6B7280] text-[11px] font-semibold uppercase tracking-wide">
                    {s.label}
                  </p>
                  <p className="text-[#0B0D12] font-bold text-lg mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-[#F6F7FB] border border-[#D8E0ED] rounded-2xl p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">
              Product SKU
            </p>
            <p className="font-mono text-sm text-[#0B0D12]">{product.sku}</p>
            <p className="text-[#6B7280] text-xs mt-1.5 leading-relaxed">
              This SKU is sent to Dynamic Yield with every event you trigger here.
            </p>
          </div>

          <button
            onClick={() => {
              dy.applicationStarted(product);
              setStep("form");
            }}
            className="w-full text-white py-3.5 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: "#0B0D12" }}
          >
            Apply for {product.name}
          </button>
          <p className="text-center text-[#6B7280] text-[11px]">
            Fires an <span className="font-semibold">Application Started</span> event
          </p>
        </div>
      )}

      {step === "form" && (
        <div className="px-5 py-6 space-y-5 flex-1">
          <div>
            <h2 className="font-bold text-[#0B0D12] text-lg" style={{ letterSpacing: "-0.01em" }}>
              Your application
            </h2>
            <p className="text-[#6B7280] text-sm mt-0.5">
              We&apos;ve pre-filled your details — just review and submit.
            </p>
          </div>

          <form
            className="space-y-3.5"
            onSubmit={(e) => {
              e.preventDefault();
              dy.submission(product);
              setStep("done");
            }}
          >
            {[
              { label: "Full name", value: profile.name },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                  {f.label}
                </label>
                <input
                  defaultValue={f.value}
                  className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-[#0B0D12] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mt-1"
            >
              Submit application
            </button>
            <p className="text-center text-[#6B7280] text-[11px]">
              Fires a <span className="font-semibold">Submission</span> event
            </p>
          </form>
        </div>
      )}

      {step === "done" && (
        <div className="px-5 py-10 flex-1 flex flex-col items-center justify-center text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-5"
            style={{ background: "#16A34A" }}
          >
            ✓
          </div>
          <h2 className="font-bold text-[#0B0D12] text-xl" style={{ letterSpacing: "-0.01em" }}>
            Application submitted
          </h2>
          <p className="text-[#6B7280] text-sm mt-2 max-w-[260px]">
            Thanks {profile.name.split(" ")[0]} — your application for {product.name} is
            with our team. We&apos;ll be in touch shortly.
          </p>
          <button
            onClick={close}
            className="mt-7 w-full bg-[#0B0D12] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
          >
            Back to NexaBank
          </button>
        </div>
      )}
    </div>
  );
}
