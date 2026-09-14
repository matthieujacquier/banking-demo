"use client";

import { useState } from "react";
import Link from "next/link";

export interface PersonaPanel {
  id: string;
  label: string;
  headline: string;
  points: string[];
  products: { sku: string; name: string; displayPrice: string; url: string; accent: string; category: string }[];
}

// "What this means for you" — a persona-switchable panel. Server-rendered
// data in, a tab strip out; a DY campaign can pre-select the visitor's
// persona by targeting the wrapping #dy-why-persona slot.
export default function PersonaSwitch({ panels, initial }: { panels: PersonaPanel[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? panels[0]?.id);
  const panel = panels.find((p) => p.id === active) ?? panels[0];
  if (!panel) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Choose your situation">
        {panels.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === panel.id}
            onClick={() => setActive(p.id)}
            className={`text-xs font-bold px-3.5 py-2 rounded-full border transition-colors ${
              p.id === panel.id
                ? "bg-[#0B0D12] text-white border-[#0B0D12]"
                : "bg-white text-[#1F2937] border-[#D8E0ED] hover:border-[#2563FF]/50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-2xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.02em" }}>
            {panel.headline}
          </h3>
          <ul className="space-y-3">
            {panel.points.map((pt) => (
              <li key={pt} className="flex gap-3 items-start text-[#1F2937]">
                <span className="text-[#2563FF] font-bold mt-0.5">✓</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {panel.products.map((p) => (
            <Link
              key={p.sku}
              href={p.url}
              className="bg-white rounded-2xl border border-[#D8E0ED] p-4 hover:border-[#2563FF]/50 transition-colors"
              style={{ borderTop: `3px solid ${p.accent}` }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ color: p.accent, backgroundColor: `${p.accent}18` }}
              >
                {p.category}
              </span>
              <p className="font-bold text-[#0B0D12] mt-2 text-sm leading-snug">{p.name}</p>
              <p className="text-[#6B7280] text-xs mt-1">{p.displayPrice}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
