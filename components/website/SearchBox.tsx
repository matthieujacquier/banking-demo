"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { suggest } from "@/lib/search-local";

// Search entry point for the public site. A plain GET form to /search (works
// without JS) with local autosuggest over product names and keywords on top.
export default function SearchBox({
  variant = "nav",
  defaultValue = "",
}: {
  variant?: "nav" | "hero";
  defaultValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLFormElement>(null);
  const items = open ? suggest(value) : [];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(url: string) {
    setOpen(false);
    router.push(url);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && items[active]) return go(items[active].url);
    const q = value.trim();
    go(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  const hero = variant === "hero";

  return (
    <form
      ref={wrap}
      action="/search"
      method="get"
      role="search"
      onSubmit={submit}
      className={hero ? "relative w-full max-w-2xl" : "relative hidden lg:block"}
    >
      <div
        className={
          hero
            ? "flex items-center gap-3 bg-white rounded-full pl-5 pr-2 py-2 border border-[#D8E0ED] shadow-[0_16px_34px_rgba(11,13,18,0.18)]"
            : "flex items-center gap-2 bg-white/10 hover:bg-white/[0.14] focus-within:bg-white/[0.14] border border-white/15 rounded-full pl-3 pr-1.5 py-1.5 transition-colors"
        }
      >
        <svg
          width={hero ? 20 : 15}
          height={hero ? 20 : 15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={hero ? "text-[#6B7280] shrink-0" : "text-white/60 shrink-0"}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          name="q"
          value={value}
          autoFocus={hero}
          autoComplete="off"
          aria-label="Search products"
          placeholder={hero ? "Try “savings for my kids” or “card with no FX fees”" : "Search products"}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!items.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (a + 1) % items.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={
            hero
              ? "flex-1 bg-transparent text-[#0B0D12] text-base md:text-lg placeholder:text-[#9CA3AF] focus:outline-none min-w-0"
              : "w-40 xl:w-52 bg-transparent text-white text-sm placeholder:text-white/45 focus:outline-none"
          }
        />
        {hero ? (
          <button
            type="submit"
            className="bg-[#0B0D12] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1A1F2C] transition-colors"
          >
            Search
          </button>
        ) : (
          <button type="submit" aria-label="Search" className="text-white/60 hover:text-white px-1.5 text-xs font-bold">
            ↵
          </button>
        )}
      </div>

      {items.length > 0 && (
        <ul
          className={`absolute left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border shadow-2xl ${
            hero ? "bg-white border-[#D8E0ED]" : "bg-[#0B0D12] border-white/10 min-w-[280px]"
          }`}
        >
          {items.map((s, i) => (
            <li key={s.url + s.label}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(s.url)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  hero
                    ? `text-[#1F2937] ${i === active ? "bg-[#F6F7FB]" : "hover:bg-[#F6F7FB]"}`
                    : `text-white/85 ${i === active ? "bg-white/10" : "hover:bg-white/10"}`
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
          <li>
            <button
              type="submit"
              onMouseDown={(e) => e.preventDefault()}
              className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest ${
                hero ? "text-[#2563FF] bg-[#F6F7FB]" : "text-[#9FB9FF] bg-white/5"
              }`}
            >
              Search all results for “{value.trim()}”
            </button>
          </li>
        </ul>
      )}
    </form>
  );
}
