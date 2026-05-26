"use client";

import { useState } from "react";
import type { ApiCall, CallKind } from "@/lib/dy-activity";

const KIND_COLOR: Record<CallKind, string> = {
  pageview: "#64748B",
  event: "#7C3AED",
  choose: "#2563FF",
  engagement: "#EC4899",
};

const KIND_LABEL: Record<CallKind, string> = {
  pageview: "PAGEVIEW",
  event: "EVENT",
  choose: "CHOOSE",
  engagement: "ENGAGE",
};

function StatusDot({ call }: { call: ApiCall }) {
  const color =
    call.state === "pending" ? "#F59E0B" : call.state === "success" ? "#16A34A" : "#EF4444";
  return (
    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 ${call.state === "pending" ? "dy-pulse" : ""}`}
      style={{ background: color }}
    />
  );
}

// Minimal JSON syntax highlighter — builds JSX (no innerHTML), tuned for a
// dark console background.
function JsonView({ value }: { value: unknown }) {
  const text = JSON.stringify(value ?? null, null, 2);
  const parts = text.split(
    /("(?:[^"\\]|\\.)*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,
  );
  return (
    <pre className="text-[11px] leading-[1.55] font-mono whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        let color = "#94A3B8";
        if (/^"/.test(part)) {
          color = /:\s*$/.test(part) ? "#7DD3FC" : "#A7F3D0";
        } else if (/^(true|false|null)$/.test(part)) {
          color = "#F0ABFC";
        } else if (/^-?\d/.test(part)) {
          color = "#FCD34D";
        }
        return (
          <span key={i} style={{ color }}>
            {part}
          </span>
        );
      })}
    </pre>
  );
}

export default function ApiCallCard({ call }: { call: ApiCall }) {
  const [open, setOpen] = useState(false);
  const [face, setFace] = useState<"request" | "response">("request");
  const accent = KIND_COLOR[call.kind];

  return (
    <div className="dy-card-in rounded-2xl bg-[#15171F] border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
      >
        <span
          className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded"
          style={{ color: accent, background: `${accent}22` }}
        >
          {KIND_LABEL[call.kind]}
        </span>
        <span className="flex-1 min-w-0 truncate text-[12px] font-semibold text-white">
          {call.title.replace(/^(Event|Choose|Pageview|Engagement) · /, "")}
        </span>
        <StatusDot call={call} />
        <span className="text-white/55 text-[10px]">{open ? "▲" : "▼"}</span>
      </button>

      {/* Meta line */}
      <div className="px-3 pb-2 flex items-center gap-2 text-[10px] text-white/55">
        <span className="font-mono">{call.method}</span>
        <span className="font-mono truncate flex-1 min-w-0">{call.url}</span>
        {call.status != null && <span className="font-mono">{call.status}</span>}
        {call.durationMs != null && <span className="font-mono">{call.durationMs}ms</span>}
      </div>

      {/* Expanded body */}
      {open && (
        <div className="px-3 pb-3">
          <div className="flex gap-1 mb-2">
            {(["request", "response"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFace(f)}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors ${
                  face === f
                    ? "bg-white text-[#0B0D12]"
                    : "bg-white/10 text-white/55 hover:bg-white/15"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ perspective: "1200px" }} className="relative h-[210px]">
            <div
              className={`dy-flip absolute inset-0 ${face === "response" ? "dy-flip-back" : ""}`}
            >
              <div className="dy-face absolute inset-0 overflow-auto rounded-xl bg-[#0B0D12] border border-white/10 p-2.5">
                <JsonView value={call.requestBody} />
              </div>
              <div className="dy-face dy-face-back absolute inset-0 overflow-auto rounded-xl bg-[#0B0D12] border border-white/10 p-2.5">
                {call.state === "pending" ? (
                  <p className="text-white/55 text-[11px] font-mono">Awaiting response…</p>
                ) : (
                  <JsonView value={call.responseBody} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
