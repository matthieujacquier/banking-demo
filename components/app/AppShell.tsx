"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "./BottomNav";
import InspectorPanel from "./InspectorPanel";
import ProductSheet from "./ProductSheet";
import { useDYActivity } from "@/lib/dy-activity";
import { useDY } from "@/lib/dy-client";
import { useSheet } from "@/lib/app-sheet";

const emptySubscribe = () => () => {};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { panelOpen, unread, togglePanel } = useDYActivity();
  const { product: sheetProduct } = useSheet();
  const dy = useDY();
  const booted = useRef(false);
  const screenRef = useRef<HTMLDivElement>(null);

  // false on the server / first hydration pass, true once mounted on the
  // client — lets us gate browser-only rendering without a setState effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!mounted) return;
    const stored = sessionStorage.getItem("nexabank_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    if (!booted.current) {
      booted.current = true;
      try {
        const user = JSON.parse(stored) as { email?: string };
        if (user.email) dy.identify(user.email);
      } catch {
        /* ignore malformed session */
      }
    }
  }, [mounted, router, dy]);

  useEffect(() => {
    if (screenRef.current) screenRef.current.scrollTop = 0;
  }, [sheetProduct]);

  if (!mounted) return <div className="fixed inset-0 bg-[#F6F7FB]" />;

  const stored = sessionStorage.getItem("nexabank_user");
  if (!stored) return <div className="fixed inset-0 bg-[#F6F7FB]" />;

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F6F7FB] flex items-center justify-center">
      <div className="flex items-center">
        {/* Phone */}
        <div className="relative flex-shrink-0">
          <div
            className="w-[390px] h-[844px] max-h-[calc(100dvh-2.5rem)] bg-white rounded-[44px] overflow-hidden flex flex-col border border-[#D8E0ED]"
            style={{ boxShadow: "0 40px 80px rgba(11,13,18,0.18)" }}
          >
            {/* Status bar */}
            <div className="bg-[#0B0D12] px-6 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
              <span className="text-white/55 text-xs font-medium">{time}</span>
              <span className="text-white font-bold text-sm">
                Nexa<span className="text-[#2563FF]">Bank</span>
              </span>
              <span className="text-white/55 text-[10px] tracking-tight">●●●</span>
            </div>

            {/* Scrollable screen — the only scrolling element */}
            <div ref={screenRef} className="flex-1 overflow-y-auto bg-white">
              <div className={sheetProduct ? "hidden" : ""}>{children}</div>
              {sheetProduct && <ProductSheet key={sheetProduct.sku} product={sheetProduct} />}
            </div>

            <BottomNav />
          </div>

          {/* Inspector trigger tab */}
          {!panelOpen && (
            <button
              onClick={togglePanel}
              className="absolute top-24 right-0 translate-x-full flex flex-col items-center gap-2 bg-[#0B0D12] hover:bg-[#1A1F2C] text-white rounded-r-2xl py-4 pl-1.5 pr-2 transition-colors"
              style={{ boxShadow: "0 12px 24px rgba(11,13,18,0.2)" }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ writingMode: "vertical-rl" }}
              >
                DY Activity
              </span>
              {unread > 0 && (
                <span className="bg-[#2563FF] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          )}
        </div>

        <InspectorPanel />
      </div>
    </div>
  );
}
