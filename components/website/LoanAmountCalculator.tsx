"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Tier = "entry" | "mid" | "upper-mid" | "hnw";

type DyApi = (action: "event" | "engagement" | "identify", payload: Record<string, unknown>) => void;

function getDyApi(): DyApi | undefined {
  if (typeof window === "undefined") return undefined;
  const dy = (window as unknown as { DY?: { API?: unknown } }).DY;
  return typeof dy?.API === "function" ? (dy.API as DyApi) : undefined;
}

const TERM_OPTIONS = [10, 15, 20, 25, 30] as const;

function classifyTier(amount: number): { tier: Tier; label: string } {
  if (amount < 150_000) return { tier: "entry", label: "First-time buyer" };
  if (amount < 350_000) return { tier: "mid", label: "Established household" };
  if (amount < 600_000) return { tier: "upper-mid", label: "Affluent professional" };
  return { tier: "hnw", label: "High-net-worth" };
}

function monthlyPaymentOf(amount: number, apr: number, termMonths: number): number {
  const r = apr / 100 / 12;
  if (r === 0) return amount / termMonths;
  const factor = Math.pow(1 + r, termMonths);
  return (amount * r * factor) / (factor - 1);
}

const euro = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  productSku: string;
  accentColor: string;
  apr: number;
  minAmount: number;
  maxAmount: number;
  defaultAmount?: number;
  defaultTermMonths?: number;
}

export default function LoanAmountCalculator({
  productSku,
  accentColor,
  apr,
  minAmount,
  maxAmount,
  defaultAmount = 250_000,
  defaultTermMonths = 240,
}: Props) {
  const [amount, setAmount] = useState(defaultAmount);
  const [termMonths, setTermMonths] = useState(defaultTermMonths);
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  const { tier } = useMemo(() => classifyTier(amount), [amount]);
  const monthlyPayment = useMemo(
    () => monthlyPaymentOf(amount, apr, termMonths),
    [amount, apr, termMonths],
  );

  const warnedRef = useRef(false);
  function callDy(action: "event" | "engagement" | "identify", payload: Record<string, unknown>): boolean {
    const api = getDyApi();
    if (!api) {
      if (!warnedRef.current) {
        console.warn("[LoanAmountCalculator] window.DY.API not available; signals will be no-ops");
        warnedRef.current = true;
      }
      return false;
    }
    try {
      api(action, payload);
      return true;
    } catch (err) {
      console.warn("[LoanAmountCalculator] DY API call failed", err);
      return false;
    }
  }

  // Persist the calculator state to localStorage + push to dataLayer so a DY
  // custom evaluator (or any other tag manager) can read it without depending
  // on DY's session-data lookup. Called from each effect/event below.
  function publishState(extra?: { event: string; email?: string }) {
    const payload = {
      sku: productSku,
      amount,
      termMonths,
      tier,
      monthlyPayment: Math.round(monthlyPayment),
      ...(extra?.email ? { email: extra.email } : {}),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("nexabank.realestateLoan", JSON.stringify(payload));
    } catch {
      // localStorage unavailable (private mode, quota) — ignore silently.
    }
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: extra?.event ?? "real_estate_loan_calculation", ...payload });
  }

  // Debounced custom DY event (~400ms after the user stops dragging the slider).
  // Sends the latest tier as a property so a DY audience can target on it
  // (e.g. tier === "hnw") without needing a custom evaluator.
  useEffect(() => {
    const id = window.setTimeout(() => {
      callDy("event", {
        name: "Real Estate Loan Calculation",
        properties: {
          sku: productSku,
          amount,
          termMonths,
          tier,
          monthlyPayment: Math.round(monthlyPayment),
        },
      });
      publishState({ event: "real_estate_loan_calculation" });
    }, 400);
    return () => window.clearTimeout(id);
    // publishState is intentionally not in deps — its identity changes every
    // render and the closure captures the values we care about from deps below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, termMonths, tier, monthlyPayment, productSku]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitState === "submitting") return;
    if (!EMAIL_RE.test(email)) {
      setSubmitState("error");
      return;
    }
    setSubmitState("submitting");
    callDy("identify", { cuid: email, cuidType: "email" });
    callDy("event", {
      name: "Real Estate Loan Quote Requested",
      properties: {
        sku: productSku,
        email,
        amount,
        termMonths,
        tier,
        monthlyPayment: Math.round(monthlyPayment),
      },
    });
    publishState({ event: "real_estate_loan_quote_requested", email });
    setSubmitState("sent");
  }

  function resetForm() {
    setSubmitState("idle");
    setEmail("");
  }

  return (
    <div
      className="bg-white rounded-3xl border border-[#D8E0ED] p-8"
      style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
          Estimate your loan
        </h2>
        <span className="text-xs font-semibold text-[#6B7280]">APR {apr}%</span>
      </div>

      {/* Amount slider */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <label htmlFor="loan-amount" className="text-sm font-medium text-[#6B7280]">
            Loan amount
          </label>
          <span className="text-lg font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
            {euro(amount)}
          </span>
        </div>
        <input
          id="loan-amount"
          type="range"
          min={minAmount}
          max={maxAmount}
          step={5000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 rounded-full bg-[#E5E9F2] appearance-none cursor-pointer"
          style={{ accentColor }}
        />
        <div className="flex justify-between text-xs text-[#6B7280] mt-1.5">
          <span>{euro(minAmount)}</span>
          <span>{euro(maxAmount)}</span>
        </div>
      </div>

      {/* Term pills */}
      <div className="mb-6">
        <p className="text-sm font-medium text-[#6B7280] mb-2">Term</p>
        <div className="flex flex-wrap gap-2">
          {TERM_OPTIONS.map((years) => {
            const months = years * 12;
            const active = termMonths === months;
            return (
              <button
                key={years}
                type="button"
                onClick={() => setTermMonths(months)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors"
                style={
                  active
                    ? { backgroundColor: accentColor, borderColor: accentColor, color: "#fff" }
                    : { borderColor: "#D8E0ED", color: "#0B0D12", backgroundColor: "#fff" }
                }
              >
                {years}y
              </button>
            );
          })}
        </div>
      </div>

      {/* Estimate */}
      <div className="border-t border-[#D8E0ED] pt-5 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-[#6B7280]">Estimated monthly payment</span>
          <span className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
            {euro(monthlyPayment)} <span className="text-sm font-normal text-[#6B7280]">/ mo</span>
          </span>
        </div>
      </div>

      {/* Email capture */}
      {submitState === "sent" ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#16A34A33] bg-[#16A34A0d] px-4 py-3">
          <p className="text-sm text-[#0B0D12]">
            <span className="font-bold" style={{ color: "#16A34A" }}>
              ✓
            </span>{" "}
            Quote saved. We&rsquo;ll be in touch shortly.
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-semibold text-[#6B7280] hover:text-[#0B0D12]"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor="loan-email" className="text-sm font-medium text-[#6B7280] block">
            Email me my offer
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="loan-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitState === "error") setSubmitState("idle");
              }}
              className="flex-1 px-4 py-3 rounded-full border border-[#D8E0ED] text-sm text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
            />
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="px-6 py-3 rounded-full font-bold text-sm text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#0B0D12" }}
            >
              {submitState === "submitting" ? "Sending…" : "Send my offer"}
            </button>
          </div>
          {submitState === "error" && (
            <p className="text-xs text-[#EA580C]">Please enter a valid email address.</p>
          )}
        </form>
      )}
    </div>
  );
}
