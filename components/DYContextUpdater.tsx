"use client";

import { useEffect } from "react";

// The page context DY's client script reads from window.DY.recommendationContext.
// Single source of truth — DYContext.tsx imports it from here.
export type DYPageContext =
  | { type: "HOMEPAGE" }
  | { type: "CATEGORY"; data: string[] }
  | { type: "PRODUCT"; data: string[] }
  | { type: "CART" }
  | { type: "OTHER"; data: string[] };

declare global {
  interface Window {
    DY?: { recommendationContext?: DYPageContext } & Record<string, unknown>;
  }
}

export default function DYContextUpdater({ context }: { context: DYPageContext }) {
  const key = JSON.stringify(context);
  useEffect(() => {
    window.DY = window.DY || {};
    window.DY.recommendationContext = JSON.parse(key);
  }, [key]);
  return null;
}
