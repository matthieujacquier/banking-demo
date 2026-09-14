import Link from "next/link";
import SearchBox from "@/components/website/SearchBox";
import MobileMenu from "@/components/website/MobileMenu";
import { NAV_HUBS, TOP_LINKS, navColumns, navGroups } from "@/lib/navigation";

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// Sticky dark navbar. The Personal mega-menu is generated from the catalog
// (lib/navigation.ts); ids dy-nav-links / dy-nav-products are DY targets.
export default function Navbar() {
  const columns = navColumns();
  const groups = navGroups();

  return (
    <nav className="bg-[#0B0D12] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-white flex-shrink-0 font-[var(--font-outfit)] italic font-extrabold text-2xl"
          style={{ letterSpacing: "-0.025em" }}
        >
          NEXA
        </Link>

        <div id="dy-nav-links" className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-white/65 h-16">
          {/* Personal products mega-menu */}
          <div id="dy-nav-products" className="group relative h-full flex items-center">
            <span className="flex items-center gap-1 cursor-default hover:text-white transition-colors select-none">
              Personal
              <span className="transition-transform duration-200 group-hover:rotate-180 flex items-center">
                <ChevronDown />
              </span>
            </span>
            {/* Dropdown panel — no gap so hover bridge is seamless */}
            <div className="absolute top-full left-0 hidden group-hover:block z-50 w-[min(920px,calc(100vw-3rem))]">
              <div
                className="mt-0 bg-[#0B0D12] rounded-2xl border border-white/10 p-6 grid grid-cols-4 gap-x-8 gap-y-0"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
              >
                {columns.map((col, ci) => (
                  <div key={ci} className="space-y-5">
                    {col.map((group) => (
                      <div key={group.heading}>
                        <Link
                          href={group.href}
                          className="block text-xs font-bold uppercase tracking-widest text-white mb-2 hover:text-white/80 transition-colors"
                        >
                          {group.heading}
                        </Link>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="text-sm text-white/55 hover:text-white transition-colors block py-0.5"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="col-span-4 mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2">
                  {NAV_HUBS.map((h) => (
                    <Link key={h.href} href={h.href} className="text-xs font-bold text-white/70 hover:text-white transition-colors">
                      {h.label} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {TOP_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-white transition-colors ${l.href === "/about" || l.href === "/contact" ? "hidden lg:inline" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <SearchBox />
          <Link
            href="/login"
            className="hidden sm:inline-flex border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white/5 hover:border-white/50 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/products/accounts"
            className="hidden md:inline-flex bg-white text-[#0B0D12] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
          >
            Open account
          </Link>
          <MobileMenu groups={groups} topLinks={TOP_LINKS} hubs={NAV_HUBS} />
        </div>
      </div>
    </nav>
  );
}
