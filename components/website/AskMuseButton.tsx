"use client";

import { openMuse } from "@/components/website/MuseWidget";

// Opens the Shopping Muse widget with a prefilled prompt.
export default function AskMuseButton({ prompt, className }: { prompt: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openMuse(prompt)}
      className={
        className ??
        "block w-full text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
      }
    >
      <span className="text-[#F59E0B] mr-1.5">✦</span>
      Ask Muse about this
    </button>
  );
}
