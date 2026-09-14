"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MuseText from "@/components/MuseText";
import { MUSE_MODE } from "@/lib/dy-config";
import { dyEvent, dyMuse, dyReportSlotClick, type MuseResponse } from "@/lib/dy-public";
import { getProduct, type Product } from "@/lib/products";

// Shopping Muse on the public website — DY's conversational assistant, called
// through /api/dy/muse. The launcher carries DY's `dy-chat-cta` class so the
// bank can swap in DY's own chat template later (NEXT_PUBLIC_MUSE_MODE=template)
// without touching the site.

const MAX_PROMPT = 250;
const CHAT_KEY = "nexabank_muse_chat";

export const MUSE_STARTERS = [
  "I'm married with two kids — which account and card suit us?",
  "I want to invest a little and get card benefits. What should I get?",
  "Why should I choose NexaBank over my current bank?",
  "What can I do in the NexaBank app?",
];

interface Widget {
  title?: string;
  items: { sku: string; slotId?: string; product: Product }[];
}

interface Message {
  role: "user" | "assistant";
  text: string;
  widgets?: Widget[];
  unavailable?: boolean;
  support?: boolean;
}

function resolveWidgets(res: MuseResponse): Widget[] {
  return (res.widgets ?? [])
    .map((w) => ({
      title: w.title,
      items: w.items.flatMap((i) => {
        const product = getProduct(i.sku);
        return product ? [{ sku: i.sku, slotId: i.slotId, product }] : [];
      }),
    }))
    .filter((w) => w.items.length > 0);
}

// Other components open the widget with a prefilled prompt by dispatching
// `new CustomEvent("nexabank:muse", { detail: { prompt } })`.
export function openMuse(prompt?: string) {
  window.dispatchEvent(new CustomEvent("nexabank:muse", { detail: { prompt: prompt ?? "" } }));
}

export default function MuseWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  // The DY conversation id survives navigation within the tab.
  const [chatId, setChatId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    try {
      return sessionStorage.getItem(CHAT_KEY) ?? undefined;
    } catch {
      return undefined;
    }
  });
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const openedOnce = useRef(false);

  useEffect(() => {
    function onOpen(e: Event) {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt ?? "";
      setOpen(true);
      if (prompt) setInput(prompt.slice(0, MAX_PROMPT));
    }
    window.addEventListener("nexabank:muse", onOpen);
    return () => window.removeEventListener("nexabank:muse", onOpen);
  }, []);

  useEffect(() => {
    if (open && !openedOnce.current) {
      openedOnce.current = true;
      dyEvent("Shopping Muse Chat Open", { surface: "website" });
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  // The phone-frame app has its own Muse sheet.
  if (pathname?.startsWith("/app")) return null;

  async function send(text: string) {
    const prompt = text.trim().slice(0, MAX_PROMPT);
    if (!prompt || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setSending(true);
    dyEvent("Shopping Muse Message Sent", { prompt, surface: "website" });

    const res = await dyMuse({ text: prompt, chatId });
    setSending(false);

    if (!res || res.state !== "ok" || !res.assistant) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          unavailable: true,
          text: "Muse is warming up — the Shopping Muse experience isn't live on this site yet. In the meantime, Search understands questions like this too.",
        },
      ]);
      return;
    }
    if (res.chatId) {
      setChatId(res.chatId);
      try {
        sessionStorage.setItem(CHAT_KEY, res.chatId);
      } catch {
        /* ignore */
      }
    }
    setMessages((m) => [
      ...m,
      { role: "assistant", text: res.assistant ?? "", widgets: resolveWidgets(res), support: res.support },
    ]);
  }

  function onProductClick(item: { sku: string; slotId?: string }) {
    dyReportSlotClick(item.slotId);
    dyEvent("Shopping Muse Product Click", { sku: item.sku, surface: "website" });
  }

  const lastPrompt = [...messages].reverse().find((m) => m.role === "user")?.text ?? "";

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => {
          if (MUSE_MODE === "template") return; // DY's template owns the click
          setOpen((v) => !v);
        }}
        className="dy-chat-cta fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#0B0D12] text-white pl-4 pr-5 py-3 text-sm font-bold shadow-[0_16px_34px_rgba(11,13,18,0.35)] border border-white/10 hover:bg-[#1A1F2C] transition-colors"
        aria-expanded={open}
        aria-label="Open Shopping Muse"
      >
        <Sparkle />
        Ask Muse
      </button>

      {open && MUSE_MODE === "api" && (
        <div
          role="dialog"
          aria-label="Shopping Muse"
          className="fixed bottom-20 right-5 z-[60] w-[380px] max-w-[calc(100vw-2.5rem)] h-[600px] max-h-[calc(100vh-7rem)] flex flex-col rounded-3xl bg-white border border-[#D8E0ED] shadow-[0_24px_60px_rgba(11,13,18,0.28)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-[#0B0D12] text-white">
            <span className="w-9 h-9 rounded-full bg-[#2563FF] flex items-center justify-center">
              <Sparkle />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight">Shopping Muse</p>
              <p className="text-[11px] text-white/55">Your NexaBank assistant · powered by Dynamic Yield</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F6F7FB]">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl rounded-tl-md border border-[#D8E0ED] px-4 py-3 text-sm text-[#1F2937] leading-relaxed">
                  Hi — I&apos;m Muse. Tell me about your situation and I&apos;ll point you to the right NexaBank products.
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] pt-1">Try asking</p>
                <div className="flex flex-col gap-2">
                  {MUSE_STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-left text-sm bg-white border border-[#D8E0ED] rounded-2xl px-4 py-2.5 text-[#0B0D12] hover:border-[#2563FF]/50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] bg-[#2563FF] text-white rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="space-y-3">
                  <div
                    className={`max-w-[92%] rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed border ${
                      m.unavailable
                        ? "bg-[#FFF7E6] border-[#F5D08A] text-[#7A4B00]"
                        : m.support
                          ? "bg-[#E7EEFF] border-[#2563FF]/20 text-[#1F2937]"
                          : "bg-white border-[#D8E0ED] text-[#1F2937]"
                    }`}
                  >
                    <MuseText text={m.text} />
                    {m.unavailable && (
                      <Link
                        href={`/search?q=${encodeURIComponent(lastPrompt)}`}
                        className="block mt-2 font-bold text-[#2563FF] hover:underline"
                      >
                        Search for “{lastPrompt.slice(0, 40)}
                        {lastPrompt.length > 40 ? "…" : ""}” →
                      </Link>
                    )}
                  </div>
                  {m.widgets?.map((w, j) => (
                    <div key={j}>
                      {w.title && (
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">{w.title}</p>
                      )}
                      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4">
                        {w.items.map((item) => (
                          <Link
                            key={item.sku}
                            href={item.product.url}
                            onClick={() => onProductClick(item)}
                            className="shrink-0 w-[200px] bg-white border border-[#D8E0ED] rounded-2xl p-3.5 hover:border-[#2563FF]/50 transition-colors"
                            style={{ borderTop: `3px solid ${item.product.accent}` }}
                          >
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ color: item.product.accent, background: `${item.product.accent}18` }}
                            >
                              {item.product.category}
                            </span>
                            <p className="font-bold text-sm text-[#0B0D12] mt-2 leading-snug">{item.product.name}</p>
                            <p className="text-xs text-[#6B7280] mt-1">{item.product.displayPrice}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            )}

            {sending && (
              <div className="bg-white rounded-2xl rounded-tl-md border border-[#D8E0ED] px-4 py-3 text-sm text-[#6B7280] w-fit">
                <span className="dy-pulse">Muse is thinking…</span>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-[#D8E0ED] bg-white px-3 py-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_PROMPT))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={2}
                placeholder="Ask about accounts, cards, savings, investing…"
                aria-label="Message Shopping Muse"
                className="flex-1 resize-none rounded-2xl border border-[#D8E0ED] px-3.5 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="h-10 px-4 rounded-full bg-[#0B0D12] text-white text-sm font-bold hover:bg-[#1A1F2C] disabled:opacity-40 transition-colors"
              >
                Send
              </button>
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-1.5 text-right">
              {input.length}/{MAX_PROMPT}
            </p>
          </form>
        </div>
      )}
    </>
  );
}

function Sparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13zM5 14l.7 2 2 .7-2 .7L5 19.5l-.7-2-2-.7 2-.7L5 14z" />
    </svg>
  );
}
