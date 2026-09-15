"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { openMuse } from "@/components/website/MuseWidget";
import { dyEvent } from "@/lib/dy-public";

// DY caps a Shopping Muse prompt at 250 characters.
const MAX_PROMPT = 250;

// A one or two-word query reads naturally inside a sentence ("the crypto
// product you wanted"); a longer phrase does not, so the copy stays generic.
function isShort(query: string): boolean {
  return query.length <= 18 && query.split(/\s+/).length <= 2;
}

function promptFor(query: string, total: number): string {
  const text =
    total === 0
      ? `I searched NexaBank for "${query}" and nothing came back. Which NexaBank product comes closest to what I need, and why?`
      : `I searched NexaBank for "${query}" but I'm not sure which of the results is right for me. Can you help me choose?`;
  return text.slice(0, MAX_PROMPT);
}

/**
 * The hand-off at the end of a search: once the reader reaches the bottom of
 * the results, offer Shopping Muse with the search already written into the
 * prompt, or a human advisor. Mount it with `key={query}` so each new search
 * re-arms it.
 */
export default function SearchMuseHandoff({ query, total }: { query: string; total: number }) {
  const [shown, setShown] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // The card holds its space from the start, so revealing it shifts nothing.
  // The sentinel sits directly above it: seeing the sentinel means the reader
  // has reached the end of the results.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -24px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shown) dyEvent("Search Muse Handoff Shown", { query, results: total });
  }, [shown, query, total]);

  const short = isShort(query);
  const heading =
    total === 0
      ? `Nothing matched “${query}”`
      : short
        ? `Didn’t find the ${query} product you wanted?`
        : "Didn’t find what you were looking for?";
  // Semantic search ranks the whole catalogue rather than filtering it, so the
  // result count is not worth quoting back to the reader.
  const body =
    total === 0
      ? "Describe what you are trying to do in your own words and Muse will find the closest product — or put you in front of an advisor."
      : "Tell Muse what you are trying to do and it will narrow these results down to the product that actually fits — or hand you to an advisor.";

  function askMuse() {
    dyEvent("Search Muse Handoff Clicked", { query, results: total, action: "muse" });
    openMuse(promptFor(query, total));
  }

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />
      <div
        id="dy-search-muse-handoff"
        aria-hidden={!shown}
        className={`mt-10 rounded-3xl border border-[#D8E0ED] bg-white p-6 md:p-8 shadow-[0_16px_34px_rgba(11,13,18,0.07)] transition-all duration-500 motion-reduce:transition-none ${
          shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-3">✦ Ask Muse</div>
            <h2 className="text-2xl font-bold text-[#0B0D12] mb-2 text-balance">{heading}</h2>
            <p className="text-sm text-[#6B7280] max-w-xl">{body}</p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:w-56 shrink-0">
            <button
              type="button"
              onClick={askMuse}
              tabIndex={shown ? undefined : -1}
              className="bg-[#0B0D12] text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors whitespace-nowrap"
            >
              <span className="text-[#F59E0B] mr-1.5">✦</span>
              {short ? `Ask Muse about ${query}` : "Ask Muse to help"}
            </button>
            <Link
              href="/contact"
              tabIndex={shown ? undefined : -1}
              onClick={() => dyEvent("Search Muse Handoff Clicked", { query, results: total, action: "advisor" })}
              className="border border-[#D8E0ED] text-[#0B0D12] px-5 py-3 rounded-full font-bold text-sm text-center hover:bg-[#F6F7FB] transition-colors whitespace-nowrap"
            >
              Talk to an advisor
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
