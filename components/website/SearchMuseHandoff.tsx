"use client";

import { useEffect, useRef } from "react";
import { nudgeMuse } from "@/components/website/MuseWidget";
import { dyEvent } from "@/lib/dy-public";

// DY caps a Shopping Muse prompt at 250 characters.
const MAX_PROMPT = 250;

// A one or two-word query reads naturally inside a sentence ("the crypto
// product you wanted"); a longer phrase does not, so the copy stays generic.
function isShort(query: string): boolean {
  return query.length <= 18 && query.split(/\s+/).length <= 2;
}

function greetingFor(query: string, total: number): string {
  if (total === 0) return `Nothing on the site matched “${query}”. Want me to find the NexaBank product that comes closest?`;
  if (isShort(query)) return `Didn’t find the ${query} product you wanted? I can find the one that actually fits you — shall I?`;
  return `Didn’t find what you were looking for? I can narrow this down to the product that actually fits — shall I?`;
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
 * the results, the Muse launcher opens itself on a question about this search
 * that takes one tap to answer. Renders nothing — the conversation is the UI.
 * Mount it with `key={query}` so each new search re-arms it.
 */
export default function SearchMuseHandoff({ query, total }: { query: string; total: number }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  // Seeing the sentinel means the reader has reached the end of the results.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || fired.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired.current || !entries.some((e) => e.isIntersecting)) return;
        fired.current = true;
        observer.disconnect();
        dyEvent("Search Muse Handoff Shown", { query, results: total });
        nudgeMuse(greetingFor(query, total), [
          {
            label: "Yes, go ahead",
            prompt: promptFor(query, total),
            onSelect: () => dyEvent("Search Muse Handoff Clicked", { query, results: total, action: "muse" }),
          },
          {
            label: "Talk to an advisor",
            href: "/contact",
            onSelect: () => dyEvent("Search Muse Handoff Clicked", { query, results: total, action: "advisor" }),
          },
        ]);
      },
      { rootMargin: "0px 0px -24px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [query, total]);

  return <div ref={sentinel} id="dy-search-muse-handoff" aria-hidden className="h-px" />;
}
