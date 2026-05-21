"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Product } from "./products";

interface SheetValue {
  product: Product | null;
  open(product: Product): void;
  close(): void;
}

const Ctx = createContext<SheetValue | null>(null);

// Holds the product whose detail sheet is open. The sheet renders inside the
// phone's scrollable screen (see AppShell), so it never escapes the device.
export function SheetProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const open = useCallback((p: Product) => setProduct(p), []);
  const close = useCallback(() => setProduct(null), []);
  return <Ctx.Provider value={{ product, open, close }}>{children}</Ctx.Provider>;
}

export function useSheet(): SheetValue {
  const value = useContext(Ctx);
  if (!value) throw new Error("useSheet must be used within a SheetProvider");
  return value;
}
