"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDY, useDYPageview } from "@/lib/dy-client";
import { loadIdentity, type DYIdentity } from "@/lib/dy-user";
import { CATEGORIES } from "@/lib/products";

const SETTINGS = ["Notifications", "Privacy & Security", "Payment Methods", "Help & Support"];

function truncate(value?: string): string {
  if (!value) return "—";
  return value.length > 22 ? `${value.slice(0, 22)}…` : value;
}

function readUser(): { name: string; email: string } {
  try {
    const u = JSON.parse(sessionStorage.getItem("nexabank_user") ?? "{}");
    return { name: u.name ?? "Demo User", email: u.email ?? "demo@nexabank.com" };
  } catch {
    return { name: "Demo User", email: "demo@nexabank.com" };
  }
}

export default function ProfilePage() {
  useDYPageview("OTHER", ["PROFILE"]);
  const router = useRouter();
  const dy = useDY();
  const [user] = useState(readUser);
  const [identity, setIdentity] = useState<DYIdentity>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const tick = () => setIdentity(loadIdentity());
    tick();
    const interval = setInterval(tick, 1200);
    return () => clearInterval(interval);
  }, []);

  function toggleInterest(category: string) {
    setSaved(false);
    setInterests((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  }

  function handleLogout() {
    sessionStorage.removeItem("nexabank_user");
    router.push("/");
  }

  const dyRows = [
    { label: "DY ID", value: truncate(identity.dyid) },
    { label: "Session", value: truncate(identity.session) },
    { label: "CUID (hashed email)", value: truncate(identity.cuid) },
  ];

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Identity */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#0B0D12] flex items-center justify-center text-[#2563FF] text-2xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p
            className="font-bold text-[#0B0D12] text-lg truncate"
            style={{ letterSpacing: "-0.01em" }}
          >
            {user.name}
          </p>
          <p className="text-[#6B7280] text-sm truncate">{user.email}</p>
        </div>
      </div>

      {/* DY identity */}
      <div>
        <p className="text-[11px] text-[#6B7280] uppercase tracking-widest font-bold mb-3">
          Dynamic Yield identity
        </p>
        <div className="bg-[#0B0D12] rounded-2xl p-4 space-y-2.5">
          {dyRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3 text-xs">
              <span className="text-white/45">{row.label}</span>
              <span className="font-mono text-white truncate">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">
          Captured from DY responses and the Login / Identify events. The CUID is a
          SHA-256 hash of your email — no personal data leaves the device unhashed.
        </p>
      </div>

      {/* Interests → Inform Affinity */}
      <div>
        <p className="text-[11px] text-[#6B7280] uppercase tracking-widest font-bold mb-3">
          What are you interested in?
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const active = interests.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleInterest(category)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-[#2563FF] text-white border-[#2563FF]"
                    : "bg-white text-[#6B7280] border-[#D8E0ED]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
        <button
          disabled={interests.length === 0}
          onClick={() => {
            dy.informAffinity(interests);
            setSaved(true);
          }}
          className="mt-3 w-full bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors disabled:opacity-40"
        >
          {saved ? "Interests saved ✓" : "Save interests"}
        </button>
        <p className="text-[11px] text-[#6B7280] text-center mt-2">
          Fires an <span className="font-semibold">Inform Affinity</span> event
        </p>
      </div>

      {/* Settings */}
      <div className="bg-[#F6F7FB] rounded-2xl border border-[#D8E0ED] divide-y divide-[#D8E0ED]">
        {SETTINGS.map((item) => (
          <button
            key={item}
            className="w-full flex justify-between items-center px-4 py-3.5 text-sm font-semibold text-[#0B0D12] hover:bg-[#E7EEFF] transition-colors"
          >
            {item}
            <span className="text-[#6B7280]">›</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full border border-[#D14343]/30 text-[#D14343] py-3 rounded-full text-sm font-bold hover:bg-red-50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
