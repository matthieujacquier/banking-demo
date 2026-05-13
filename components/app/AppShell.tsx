"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/app/dashboard", label: "Home", icon: "⊞" },
  { href: "/app/offers", label: "Offers", icon: "★" },
  { href: "/app/profile", label: "Profile", icon: "◯" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [, setUserName] = useState("Demo User");

  useEffect(() => {
    const stored = sessionStorage.getItem("nexabank_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUserName(JSON.parse(stored).name);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-8">
      {/* Phone frame */}
      <div className="w-[390px] min-h-[844px] bg-white rounded-[44px] overflow-hidden flex flex-col border border-[#D8E0ED]" style={{ boxShadow: "0 40px 80px rgba(11,13,18,0.18)" }}>
        {/* Status bar */}
        <div className="bg-[#0B0D12] px-6 pt-5 pb-3 flex items-center justify-between">
          <span className="text-white/60 text-xs font-medium">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-white font-bold text-sm">Nexa<span className="text-[#2563FF]">Bank</span></span>
          <span className="text-white/60 text-xs">●●●</span>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-white">{children}</div>

        {/* Bottom nav */}
        <div className="bg-white border-t border-[#D8E0ED] px-6 py-4 flex justify-around">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
                  active ? "text-[#0B0D12]" : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <span className={`text-xl ${active ? "text-[#2563FF]" : ""}`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
