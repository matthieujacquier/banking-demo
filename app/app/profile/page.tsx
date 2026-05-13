"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DYContext from "@/components/DYContext";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Demo User", email: "demo@nexabank.com" });

  useEffect(() => {
    const stored = sessionStorage.getItem("nexabank_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("nexabank_user");
    router.push("/");
  }

  const segments = [
    { label: "Segment", value: "High-value customer" },
    { label: "Affinity", value: "Travel & rewards" },
    { label: "Life stage", value: "Young professional" },
    { label: "Risk profile", value: "Moderate" },
  ];

  return (
    <div className="px-5 py-6 space-y-6">
      <DYContext context={{ type: "OTHER", data: ["PROFILE"] }} />
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#0B0D12] flex items-center justify-center text-[#2563FF] text-2xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-[#0B0D12] text-lg" style={{ letterSpacing: "-0.01em" }}>{user.name}</p>
          <p className="text-[#6B7280] text-sm">{user.email}</p>
        </div>
      </div>

      {/* DY context */}
      <div>
        <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold mb-3">DY Targeting Context</p>
        <div className="bg-[#F6F7FB] rounded-2xl border border-[#D8E0ED] divide-y divide-[#D8E0ED]">
          {segments.map((s) => (
            <div key={s.label} className="flex justify-between px-4 py-3 text-sm">
              <span className="text-[#6B7280]">{s.label}</span>
              <span className="font-semibold text-[#0B0D12]">{s.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#6B7280] mt-2 text-center">
          These attributes are used by Dynamic Yield to personalise your experience.
        </p>
      </div>

      {/* Settings */}
      <div className="bg-[#F6F7FB] rounded-2xl border border-[#D8E0ED] divide-y divide-[#D8E0ED]">
        {["Notifications", "Privacy & Security", "Payment Methods", "Help & Support"].map((item) => (
          <button key={item} className="w-full flex justify-between items-center px-4 py-3.5 text-sm font-semibold text-[#0B0D12] hover:bg-[#E7EEFF] transition-colors">
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
