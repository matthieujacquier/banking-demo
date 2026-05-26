"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDY } from "@/lib/dy-client";
import { DY_SELECTORS } from "@/lib/dy-config";

// Expected CUSTOM_JSON payload shape configured in DY Experience OS:
// {
//   "title": "Talk to an advisor",
//   "body":  "Looks like your portfolio is growing — want a quick check-in?",
//   "ctaLabel": "Book a call",
//   "ctaHref":  "/app/contact"
// }
interface AdvisorContent {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface Variation {
  payload?: { type?: string; data?: AdvisorContent };
}

interface Choice {
  name?: string;
  type?: string;
  decisionId?: string;
  variations?: Variation[];
}

interface ChooseResponse {
  choices?: Choice[];
}

function extractDecision(res: unknown): { content: AdvisorContent; decisionId?: string } | null {
  const choices = (res as ChooseResponse | null)?.choices;
  if (!Array.isArray(choices)) return null;
  const choice = choices.find((c) => c.name === DY_SELECTORS.investAdvisorPrompt);
  if (!choice || choice.type !== "DECISION") return null;
  const payload = choice.variations?.[0]?.payload;
  if (payload?.type !== "CUSTOM_JSON" || !payload.data) return null;
  return { content: payload.data, decisionId: choice.decisionId };
}

export default function AdvisorPromptModal() {
  const dy = useDY();
  const [content, setContent] = useState<AdvisorContent | null>(null);
  const [decisionId, setDecisionId] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await dy.choose([DY_SELECTORS.investAdvisorPrompt], {
        type: "OTHER",
        data: ["INVESTMENTS"],
      });
      if (cancelled) return;
      const decision = extractDecision(res);
      if (decision) {
        setContent(decision.content);
        setDecisionId(decision.decisionId);
        setOpen(true);
        // Variation impression — DY uses this to compute exposure / conversion.
        if (decision.decisionId) {
          dy.reportEngagement("IMP", { decisionId: decision.decisionId });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dy]);

  if (!open || !content) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="w-full bg-white rounded-t-3xl p-6 pb-7 shadow-2xl"
        style={{ animation: "savings-slide 0.35s ease-out" }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F6F7FB] hover:bg-[#E7EEFF] text-[#6B7280] flex items-center justify-center text-sm"
        >
          ✕
        </button>
        <div
          className="w-12 h-12 rounded-2xl mb-3 flex items-center justify-center text-white text-xl"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)" }}
        >
          ★
        </div>
        <h2 className="text-lg font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
          {content.title ?? "Talk to an advisor"}
        </h2>
        {content.body && (
          <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">{content.body}</p>
        )}
        <Link
          href={content.ctaHref ?? "/app/contact"}
          onClick={() => {
            if (decisionId) dy.reportEngagement("CLICK", { decisionId });
          }}
          className="mt-5 block w-full bg-[#0B0D12] text-white text-center py-3 rounded-full text-sm font-bold hover:bg-[#1A1F2C] transition-colors"
        >
          {content.ctaLabel ?? "Book a call"}
        </Link>
      </div>
    </div>
  );
}
