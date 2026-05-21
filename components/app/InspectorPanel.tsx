"use client";

import { useDYActivity } from "@/lib/dy-activity";
import ApiCallCard from "./ApiCallCard";

export default function InspectorPanel() {
  const { calls, panelOpen, panelWidth, clear, togglePanel, setPanelWidth, setResizing } =
    useDYActivity();

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    setResizing(true);
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      const raw = window.innerWidth - ev.clientX;
      const max = Math.min(820, window.innerWidth - 440);
      setPanelWidth(Math.max(320, Math.min(raw, max)));
    };
    const onUp = () => {
      setResizing(false);
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      style={{ width: panelWidth }}
      className={`fixed top-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-out ${
        panelOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Resize handle */}
      <div
        onMouseDown={startResize}
        className="absolute left-0 top-0 bottom-0 w-3 -translate-x-1/2 cursor-ew-resize z-20 group"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/15 group-hover:w-[3px] group-hover:bg-[#2563FF] transition-all" />
      </div>

      <div
        className="h-full flex flex-col bg-[#0B0D12] border-l border-white/10"
        style={{ boxShadow: "-30px 0 70px rgba(0,0,0,0.55)" }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#2563FF]">
              Dynamic Yield
            </p>
            <h2 className="text-white font-bold text-xl mt-0.5" style={{ letterSpacing: "-0.02em" }}>
              API Activity
            </h2>
            <p className="text-white/55 text-[11px] mt-0.5">
              {calls.length} server-side call{calls.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clear}
              className="text-white/60 hover:text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={togglePanel}
              aria-label="Close panel"
              className="text-white/60 hover:text-white w-7 h-7 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Calls */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {calls.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </div>
              <p className="text-white text-sm font-semibold">No calls yet</p>
              <p className="text-white/55 text-[11px] mt-1.5 leading-relaxed">
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
