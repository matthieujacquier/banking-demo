"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface MuseValue {
  isOpen: boolean;
  prefill: string;
  open(prefill?: string): void;
  close(): void;
}

const Ctx = createContext<MuseValue | null>(null);

// Whether the in-app Shopping Muse sheet is open (rendered inside the phone
// screen by AppShell, like ProductSheet) and an optional prefilled prompt.
export function MuseProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [prefill, setPrefill] = useState("");
  const open = useCallback((p?: string) => {
    setPrefill(p ?? "");
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  return <Ctx.Provider value={{ isOpen, prefill, open, close }}>{children}</Ctx.Provider>;
}

export function useMuse(): MuseValue {
  const value = useContext(Ctx);
  if (!value) throw new Error("useMuse must be used within a MuseProvider");
  return value;
}
