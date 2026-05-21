"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CallKind = "choose" | "pageview" | "event" | "engagement";
export type CallState = "pending" | "success" | "error";

export interface ApiCall {
  id: string;
  ts: number;
  kind: CallKind;
  title: string;
  method: "POST";
  url: string;
  requestBody: unknown;
  responseBody?: unknown;
  status?: number;
  durationMs?: number;
  state: CallState;
}

interface RecordInput {
  kind: CallKind;
  title: string;
  url: string;
  requestBody: unknown;
}

interface DYActivityValue {
  calls: ApiCall[];
  panelOpen: boolean;
  unread: number;
  record(input: RecordInput): string;
  update(id: string, patch: Partial<ApiCall>): void;
  clear(): void;
  togglePanel(): void;
}

const Ctx = createContext<DYActivityValue | null>(null);

const MAX_CALLS = 50;

export function DYActivityProvider({ children }: { children: ReactNode }) {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const panelOpenRef = useRef(false);

  const record = useCallback((input: RecordInput): string => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `call-${Date.now()}-${Math.random()}`;
    const call: ApiCall = {
      id,
      ts: Date.now(),
      method: "POST",
      state: "pending",
      ...input,
    };
    setCalls((prev) => [call, ...prev].slice(0, MAX_CALLS));
    if (!panelOpenRef.current) setUnread((u) => u + 1);
    return id;
  }, []);

  const update = useCallback((id: string, patch: Partial<ApiCall>) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const clear = useCallback(() => {
    setCalls([]);
    setUnread(0);
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen((open) => {
      const next = !open;
      panelOpenRef.current = next;
      if (next) setUnread(0);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ calls, panelOpen, unread, record, update, clear, togglePanel }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDYActivity(): DYActivityValue {
  const value = useContext(Ctx);
  if (!value) throw new Error("useDYActivity must be used within a DYActivityProvider");
  return value;
}
