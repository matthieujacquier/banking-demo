"use client";

import { useEffect, useRef, useState } from "react";
import MuseText from "@/components/MuseText";
import { useDY } from "@/lib/dy-client";
import { useMuse } from "@/lib/app-muse";
import { useSheet } from "@/lib/app-sheet";
import { loadProfile, profileContextLine } from "@/lib/profile";
import { getProduct, CATEGORY_ACCENT, type Product } from "@/lib/products";

// Shopping Muse inside the phone frame. Every call goes through useDY().muse()
// so it shows up in the DY Activity inspector; product taps open the in-app
// ProductSheet and report a SLOT_CLICK.

const MAX_PROMPT = 250;

const STARTERS = [
  "Which investment suits a risk-averse profile of 6/10?",
  "Should I move my savings to a better rate?",
  "What card benefits would I get from an upgrade?",
  "How do I start saving for my kids?",
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

interface MuseResponseShape {
  state?: "ok" | "unavailable";
  assistant?: string;
  support?: boolean;
  chatId?: string;
  widgets?: { title?: string; items: { sku: string; slotId?: string }[] }[];
}

export default function MuseSheet() {
  const dy = useDY();
  const { close, prefill } = useMuse();
  const { open: openProduct } = useSheet();
  const [input, setInput] = useState(prefill);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [useProfile, setUseProfile] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  const contextLine = profileContextLine(loadProfile());

  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      dy.event("Shopping Muse Chat Open", "Shopping Muse Chat Open", { surface: "app" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  // The prompt DY receives: the customer's words, plus their declared profile
  // when the toggle is on — visible in the Inspector, nothing hidden.
  function compose(text: string): string {
    const base = text.trim();
    if (!useProfile || !contextLine) return base.slice(0, MAX_PROMPT);
    const room = MAX_PROMPT - contextLine.length - 1;
    return `${base.slice(0, Math.max(0, room))} ${contextLine}`.trim().slice(0, MAX_PROMPT);
  }

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const prompt = compose(text);
    setInput("");
    setMessages((m) => [...m, { role: "user", text: text.trim() }]);
    setSending(true);
    dy.event("Shopping Muse Message Sent", "Shopping Muse Message Sent", {
      prompt,
      profileContext: useProfile && !!contextLine,
      surface: "app",
    });

    const res = (await dy.muse(prompt, chatId)) as MuseResponseShape | null;
    setSending(false);

    if (!res || res.state !== "ok" || !res.assistant) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          unavailable: true,
          text: "Muse is warming up — the Shopping Muse experience isn't live on this site yet. The request and DY's answer are in the DY Activity panel.",
        },
      ]);
      return;
    }
    if (res.chatId) setChatId(res.chatId);
    const widgets: Widget[] = (res.widgets ?? [])
      .map((w) => ({
        title: w.title,
        items: w.items.flatMap((i) => {
          const product = getProduct(i.sku);
          return product ? [{ sku: i.sku, slotId: i.slotId, product }] : [];
        }),
      }))
      .filter((w) => w.items.length > 0);
    setMessages((m) => [...m, { role: "assistant", text: res.assistant ?? "", widgets, support: res.support }]);
  }

  function onProductTap(item: { sku: string; slotId?: string; product: Product }) {
    if (item.slotId) dy.reportEngagement("SLOT_CLICK", { slotId: item.slotId });
    dy.event("Shopping Muse Product Click", "Shopping Muse Product Click", { sku: item.sku, surface: "app" });
    openProduct(item.product);
  }

  return (
    <div className="min-h-full bg-[#F6F7FB] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 bg-[#0B0D12] text-white flex items-center gap-3">
        <button
          onClick={close}
          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight">Shopping Muse</p>
          <p className="text-[11px] text-white/55">Powered by Dynamic Yield</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
      </div>

      {/* Profile toggle */}
      <label className="flex items-center gap-3 px-5 py-3 bg-white border-b border-[#D8E0ED] text-xs text-[#1F2937]">
        <input
          type="checkbox"
          checked={useProfile}
          onChange={(e) => setUseProfile(e.target.checked)}
          className="accent-[#2563FF] w-4 h-4"
        />
        <span className="flex-1">
          <span className="font-semibold">Use my profile</span>
          <span className="block text-[11px] text-[#6B7280] truncate">
            {contextLine || "No financial profile yet — set one on the Profile screen"}
          </span>
        </span>
      </label>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl rounded-tl-md border border-[#D8E0ED] px-4 py-3 text-sm text-[#1F2937] leading-relaxed">
              Ask me anything about your money — I know your NexaBank products and can suggest what fits next.
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] pt-1">Try asking</p>
            <div className="flex flex-col gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
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
              </div>
              {m.widgets?.map((w, j) => (
                <div key={j}>
                  {w.title && (
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">{w.title}</p>
                  )}
                  <div className="space-y-2">
                    {w.items.map((item) => {
                      const accent = CATEGORY_ACCENT[item.product.category];
                      return (
                        <button
                          key={item.sku}
                          onClick={() => onProductTap(item)}
                          className="w-full text-left bg-white border border-[#D8E0ED] rounded-2xl p-3.5 flex items-center gap-3 hover:border-[#2563FF]/40 transition-colors"
                        >
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: accent }}
                          >
                            {item.product.category.charAt(0)}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block font-bold text-sm text-[#0B0D12] truncate">{item.product.name}</span>
                            <span className="block text-xs text-[#6B7280]">{item.product.displayPrice}</span>
                          </span>
                          <span className="text-[#2563FF] font-bold">→</span>
                        </button>
                      );
                    })}
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
            placeholder="Ask Muse…"
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
          {compose(input).length}/{MAX_PROMPT} sent to DY
        </p>
      </form>
    </div>
  );
}
