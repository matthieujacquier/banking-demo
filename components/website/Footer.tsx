"use client";

import Link from "next/link";
import { CATEGORY_CONFIGS } from "@/lib/catalog-config";

function resetDemo() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    /* ignore */
  }
  window.location.href = "/";
}

const EXPLORE = [
  { label: "Search", href: "/search" },
  { label: "Business banking", href: "/business" },
  { label: "Family & kids", href: "/family" },
  { label: "Rates & fees", href: "/rates" },
  { label: "Compare products", href: "/compare" },
  { label: "Why NexaBank", href: "/why-nexabank" },
  { label: "Help centre", href: "/help" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B0D12] text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-white font-semibold mb-4">Products</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {CATEGORY_CONFIGS.map((c) => (
              <li key={c.category}>
                <Link href={`/products/${c.routeSlug}`} className="hover:text-white transition-colors">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Explore</p>
          <ul className="space-y-3">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Company</p>
          <ul className="space-y-3">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Legal</p>
          <ul className="space-y-3">
            <li>
              <span>Privacy Policy</span>
            </li>
            <li>
              <span>Terms of Use</span>
            </li>
            <li>
              <span className="text-white/40 text-xs leading-relaxed block">
                Deposits protected up to €100,000 per depositor by the EU Deposit Guarantee Scheme. Investments and crypto
                assets put your capital at risk.
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-xs flex items-center justify-between max-w-7xl mx-auto px-6">
        <span>© {new Date().getFullYear()} NexaBank. Demo purposes only.</span>
        <button
          onClick={resetDemo}
          className="text-white/20 hover:text-white/60 transition-colors text-[10px] tracking-wide"
          title="Clear localStorage + sessionStorage and reload"
        >
          reset demo
        </button>
      </div>
    </footer>
  );
}
