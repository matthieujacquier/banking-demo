"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup, NavItem } from "@/lib/navigation";

// Navigation under the md breakpoint: a full-screen panel with search, the
// category accordion, hub links and the sign-in / open-account CTAs.
export default function MobileMenu({
  groups,
  topLinks,
  hubs,
}: {
  groups: NavGroup[];
  topLinks: NavItem[];
  hubs: NavItem[];
}) {
  const pathname = usePathname();
  // The menu is open only for the page it was opened on, so navigating
  // closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] bg-[#0B0D12] text-white overflow-y-auto">
          <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
            <span className="font-[var(--font-outfit)] italic font-extrabold text-2xl" style={{ letterSpacing: "-0.025em" }}>
              NEXA
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-6 space-y-8">
            <form action="/search" method="get" role="search" className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full pl-4 pr-1.5 py-1.5">
              <input
                name="q"
                placeholder="Search products"
                aria-label="Search products"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/45 focus:outline-none"
              />
              <button type="submit" className="bg-white text-[#0B0D12] px-4 py-2 rounded-full text-xs font-bold">
                Search
              </button>
            </form>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/45 mb-3">Products</p>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {groups.map((g) => (
                  <details key={g.heading} className="group">
                    <summary className="flex items-center justify-between py-3.5 cursor-pointer list-none font-semibold">
                      {g.heading}
                      <span className="text-white/45 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <ul className="pb-3 space-y-1">
                      <li>
                        <Link href={g.href} className="block py-1.5 text-sm text-white/85 hover:text-white">
                          All {g.heading.toLowerCase()}
                        </Link>
                      </li>
                      {g.items.map((i) => (
                        <li key={i.href}>
                          <Link href={i.href} className="block py-1.5 text-sm text-white/60 hover:text-white">
                            {i.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[...hubs, ...topLinks].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm font-semibold text-white/85 hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center border border-white/25 text-white px-4 py-3 rounded-full text-sm font-bold hover:bg-white/5"
              >
                Sign in
              </Link>
              <Link
                href="/products/accounts"
                className="flex-1 text-center bg-white text-[#0B0D12] px-4 py-3 rounded-full text-sm font-bold hover:bg-[#F6F7FB]"
              >
                Open account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
