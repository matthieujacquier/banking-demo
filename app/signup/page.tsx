"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DYContext from "@/components/DYContext";
import { fireLoginEvent } from "@/lib/dy-script";
import { CATEGORY_ACCENT, getProduct } from "@/lib/products";

const STEPS = ["Your details", "Identity check", "Confirm"];

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
      />
    </div>
  );
}

function SignupFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const product = getProduct(params.get("product") ?? "");
  const accent = product ? CATEGORY_ACCENT[product.category] : "#2563FF";

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@demo.com",
    dob: "1992-04-18",
    address: "Rue de la Loi 42, 1000 Brussels",
    idType: "Passport",
    idNumber: "BE-PP-4471829",
  });
  const set = (key: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  async function finish() {
    await fireLoginEvent(form.email);
    sessionStorage.setItem(
      "nexabank_user",
      JSON.stringify({ name: form.name, email: form.email }),
    );
    router.push("/app/home");
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] flex flex-col items-center justify-center px-6 py-12">
      <DYContext context={{ type: "OTHER", data: ["SIGNUP"] }} />
      <Link href="/" className="text-2xl font-bold text-white mb-8">
        Nexa<span className="text-[#2563FF]">Bank</span>
      </Link>

      <div
        className="bg-white rounded-3xl p-8 w-full max-w-sm"
        style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.2)" }}
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-colors"
                style={{ background: i <= step ? accent : "#D8E0ED" }}
              />
              <p
                className="text-[10px] font-bold uppercase tracking-wide mt-1.5"
                style={{ color: i <= step ? "#0B0D12" : "#6B7280" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h1
                className="text-xl font-bold text-[#0B0D12]"
                style={{ letterSpacing: "-0.01em" }}
              >
                Open your account
              </h1>
              <p className="text-[#6B7280] text-sm mt-0.5">
                We&apos;ve pre-filled everything — just review and continue.
              </p>
            </div>
            <Field label="Full name" value={form.name} onChange={set("name")} />
            <Field label="Email" value={form.email} onChange={set("email")} type="email" />
            <Field label="Date of birth" value={form.dob} onChange={set("dob")} type="date" />
            <Field label="Address" value={form.address} onChange={set("address")} />
            <button
              onClick={() => setStep(1)}
              className="w-full bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mt-1"
            >
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h1
                className="text-xl font-bold text-[#0B0D12]"
                style={{ letterSpacing: "-0.01em" }}
              >
                Identity check
              </h1>
              <p className="text-[#6B7280] text-sm mt-0.5">
                A quick KYC step to verify it&apos;s really you.
              </p>
            </div>
            <Field label="ID type" value={form.idType} onChange={set("idType")} />
            <Field label="ID number" value={form.idNumber} onChange={set("idNumber")} />
            <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-2xl p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-sm">
                ✓
              </span>
              <div>
                <p className="text-sm font-bold text-[#0B0D12]">Document uploaded</p>
                <p className="text-xs text-[#6B7280]">passport-scan.jpg · verified</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h1
                className="text-xl font-bold text-[#0B0D12]"
                style={{ letterSpacing: "-0.01em" }}
              >
                Review &amp; confirm
              </h1>
              <p className="text-[#6B7280] text-sm mt-0.5">
                You&apos;re almost a NexaBank customer.
              </p>
            </div>

            <div
              className="rounded-2xl p-4 text-white"
              style={{ background: accent }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                {product ? "Selected product" : "Your account"}
              </p>
              <p className="font-bold text-lg mt-0.5">
                {product ? product.name : "NexaBank Current Account"}
              </p>
              {product && <p className="text-white/85 text-sm">{product.displayPrice}</p>}
            </div>

            <div className="bg-[#F6F7FB] rounded-2xl border border-[#D8E0ED] divide-y divide-[#D8E0ED]">
              {[
                ["Name", form.name],
                ["Email", form.email],
                ["Date of birth", form.dob],
                ["ID", `${form.idType} · ${form.idNumber}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 px-4 py-2.5 text-xs">
                  <span className="text-[#6B7280]">{label}</span>
                  <span className="font-semibold text-[#0B0D12] truncate">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Back
              </button>
              <button
                onClick={finish}
                className="flex-1 bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
              >
                Open my account
              </button>
            </div>
            <p className="text-center text-[#6B7280] text-[11px]">
              Fires a <span className="font-semibold">Login</span> event to Dynamic Yield
            </p>
          </div>
        )}

        <p className="text-xs text-[#6B7280] text-center mt-6">Demo only · Not a real bank</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <SignupFlow />
    </Suspense>
  );
}
