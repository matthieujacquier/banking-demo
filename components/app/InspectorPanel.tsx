"use client";

import { useDYActivity } from "@/lib/dy-activity";
import ApiCallCard from "./ApiCallCard";

export default function InspectorPanel() {
  const { calls, panelOpen, clear, togglePanel } = useDYActivity();

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-out ${
        panelOpen ? "w-[404px] opacity-100" : "w-0 opacity-0"
      }`}
    >
      <div
        className="w-[380px] ml-6 h-[844px] max-h-[calc(100dvh-2.5rem)] bg-[#0B0D12] rounded-[28px] border border-white/10 flex flex-col overflow-hidden"
        style={{ boxShadow: "0 40px 80px rgba(11,13,18,0.25)" }}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-4 border-b border-white/10 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563FF]">
              Dynamic Yield
            </p>
            <h2 className="text-white font-bold text-base mt-0.5">API Activity</h2>
            <p className="text-white/40 text-[11px] mt-0.5">
              {calls.length} server-side call{calls.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clear}
              className="text-white/55 hover:text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={togglePanel}
              aria-label="Close panel"
              className="text-white/55 hover:text-white w-7 h-7 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Calls */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {calls.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl mb-3">
                ⚡
              </div>
              <p className="text-white/70 text-sm font-semibold">No calls yet</p>
              <p className="text-white/40 text-[11px] mt-1.5 leading-relaxed">
                Move through the app — identify, recommendations, and behavioural
                events to Dynamic Yield appear here in real time, with full request
                and response payloads.
              </p>
            </div>
          ) : (
            calls.map((call) => <ApiCallCard key={call.id} call={call} />)
          )}
        </div>
      </div>
    </div>
  );
}
