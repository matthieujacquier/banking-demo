"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  accounts: <path d="M3 6h18v12H3zM3 10h18" />,
  invest: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  products: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  profile: <path d="M12 11a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6" />,
};

const TABS = [
  { href: "/app/home", label: "Home", icon: "home" },
  { href: "/app/accounts", label: "Accounts", icon: "accounts" },
  { href: "/app/investments", label: "Invest", icon: "invest" },
  { href: "/app/products", label: "Products", icon: "products" },
  { href: "/app/profile", label: "Profile", icon: "profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t border-[#D8E0ED] px-2 py-2.5 flex justify-around flex-shrink-0">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-semibold transition-colors ${
              active ? "text-[#2563FF]" : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={active ? 2.4 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[tab.icon]}
            </svg>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
