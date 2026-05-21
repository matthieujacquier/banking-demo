"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "./BottomNav";
import InspectorPanel from "./InspectorPanel";
import ProductSheet from "./ProductSheet";
import { useDYActivity } from "@/lib/dy-activity";
import { useDY } from "@/lib/dy-client";
import { useSheet } from "@/lib/app-sheet";

const emptySubscribe = () => () => {};

function StatusIcons() {
  return (
    <div className="flex items-center gap-1.5 text-[#0B0D12]">
      {/* Cellular */}
      <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor" aria-hidden="true">
        <rect x="0" y="7.5" width="3.2" height="3.5" rx="1" />
        <rect x="4.9" y="5" width="3.2" height="6" rx="1" />
        <rect x="9.8" y="2.5" width="3.2" height="8.5" rx="1" />
        <rect x="14.7" y="0" width="3.2" height="11" rx="1" />
      </svg>
      {/* Wi-Fi */}
      <svg
        width="16"
        height="11"
        viewBox="0 0 16 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M1.4 3.7C3.2 2.1 5.5 1.2 8 1.2s4.8.9 6.6 2.5" />
        <path d="M3.9 6.4C5 5.4 6.4 4.8 8 4.8s3 .6 4.1 1.6" />
        <path d="M8 9.1h.01" />
      </svg>
      {/* Battery */}
      <svg width="27" height="12" viewBox="0 0 27 12" fill="none" aria-hidden="true">
        <rect
          x="0.6"
          y="0.6"
          width="22"
          height="10.8"
          rx="3"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.1"
        />
        <rect x="2.5" y="2.5" width="14.5" height="7" rx="1.6" fill="currentColor" />
        <path
          d="M24.4 4v4"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { panelOpen, unread, panelWidth, resizing, togglePanel } = useDYActivity();
  const { product: sheetProduct } = useSheet();
  const dy = useDY();
  const booted = useRef(false);
  const screenRef = useRef<HTMLDivElement>(null);

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

  if (!mounted) return <div className="fixed inset-0 bg-[#0B0D12]" />;

  const stored = sessionStorage.getItem("nexabank_user");
  if (!stored) return <div className="fixed inset-0 bg-[#0B0D12]" />;

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`fixed inset-0 overflow-hidden flex items-center justify-center ${
        resizing ? "" : "transition-[padding] duration-300 ease-out"
      }`}
      style={{
        background:
          "radial-gradient(120% 110% at 50% -10%, #2C3548 0%, #14171F 55%, #0A0B0F 100%)",
        paddingRight: panelOpen ? panelWidth : 0,
      }}
    >
      {/* iPhone device — brushed titanium frame */}
      <div
        className="relative w-[410px] h-[860px] max-h-[calc(100dvh-2.5rem)] rounded-[54px] p-[7px]"
        style={{
          background:
            "linear-gradient(135deg, #D6D9DE 0%, #8C9099 16%, #C2C6CC 32%, #767A83 50%, #B4B8BF 66%, #7E828B 82%, #CBCED3 100%)",
          boxShadow:
            "0 50px 100px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 0 1px rgba(0,0,0,0.25)",
        }}
      >
        {/* Side buttons */}
        <div
          aria-hidden="true"
          className="absolute left-[-2px] top-[118px] w-[3px] h-[26px] rounded-l bg-[#6E727B]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[-2px] top-[168px] w-[3px] h-[52px] rounded-l bg-[#6E727B]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[-2px] top-[234px] w-[3px] h-[52px] rounded-l bg-[#6E727B]"
        />
        <div
          aria-hidden="true"
          className="absolute right-[-2px] top-[200px] w-[3px] h-[86px] rounded-r bg-[#6E727B]"
        />

        {/* Black inner rim */}
        <div className="relative w-full h-full rounded-[47px] bg-black p-[3px]">
          {/* Screen */}
          <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-white flex flex-col">
          {/* Dynamic Island */}
          <div
            aria-hidden="true"
            className="absolute top-[9px] left-1/2 -translate-x-1/2 z-30 w-[120px] h-[34px] rounded-full bg-black flex items-center justify-end pr-3"
          >
            <span className="w-[7px] h-[7px] rounded-full bg-[#16181F]" />
          </div>

          {/* iOS status bar */}
          <div className="relative z-20 flex items-center justify-between px-8 h-[54px] flex-shrink-0 bg-white">
            <span className="text-[15px] font-semibold text-[#0B0D12] tabular-nums tracking-tight">
              {time}
            </span>
            <StatusIcons />
          </div>

          {/* Scrollable screen — the only scrolling element */}
          <div ref={screenRef} className="flex-1 overflow-y-auto bg-white">
            <div className={sheetProduct ? "hidden" : ""}>{children}</div>
            {sheetProduct && <ProductSheet key={sheetProduct.sku} product={sheetProduct} />}
          </div>

          <BottomNav />

          {/* Home indicator */}
          <div
            aria-hidden="true"
            className="absolute bottom-[7px] left-1/2 -translate-x-1/2 z-30 w-[132px] h-[5px] rounded-full bg-[#0B0D12]"
          />
          </div>
        </div>
      </div>

      {/* Back to public website */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-40 flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/[0.16] border border-white/15 backdrop-blur px-4 py-2.5 text-white text-sm font-semibold transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to website
      </Link>

      {/* Inspector trigger */}
      {!panelOpen && (
        <button
          onClick={togglePanel}
          className="fixed top-6 right-6 z-40 flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/[0.16] border border-white/15 backdrop-blur px-4 py-2.5 text-white text-sm font-semibold transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#2563FF]" />
          DY Activity
          {unread > 0 && (
            <span className="bg-[#2563FF] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}

      <InspectorPanel />
    </div>
  );
}
