// Client-side helpers for the PUBLIC website's server-side DY calls (search,
// Muse, engagement, events). The public site is identified to DY by the
// cookies DY's own client script sets (_dyid, _dyid_server, _dyjsession);
// we read those so server-side calls share the same profile, and write back
// any cookies DY returns.

import type { SearchData, SearchFilter } from "./search-local";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function dyIdentity() {
  const dyid = readCookie("_dyid");
  const dyidServer = readCookie("_dyid_server");
  const session = readCookie("_dyjsession");
  return {
    user: {
      active_consent_accepted: true,
      ...(dyid ? { dyid } : {}),
      ...(dyidServer ? { dyid_server: dyidServer } : dyid ? { dyid_server: dyid } : {}),
    },
    session: session ? { dy: session } : {},
  };
}

interface DYCookie {
  name: string;
  value: string;
  maxAge?: number;
}

export function applyDYCookies(cookies: unknown) {
  if (!Array.isArray(cookies) || typeof document === "undefined") return;
  for (const c of cookies as DYCookie[]) {
    if (!c?.name || !c?.value) continue;
    const maxAge = typeof c.maxAge === "number" && c.maxAge > 0 ? c.maxAge : 60 * 60 * 24 * 365;
    document.cookie = `${c.name}=${encodeURIComponent(c.value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

async function post<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    const data = (await res.json().catch(() => null)) as (T & { cookies?: unknown }) | null;
    if (data && "cookies" in data) applyDYCookies(data.cookies);
    return data;
  } catch {
    return null;
  }
}

function pageRef() {
  return typeof window === "undefined"
    ? {}
    : { location: window.location.href, referrer: document.referrer };
}

export interface SearchResponse {
  _source: "dy" | "local";
  decisionId?: string;
  data: SearchData;
  cookies?: unknown;
  _debug?: unknown;
}

export interface SearchParams {
  text: string;
  filters?: SearchFilter[];
  pagination?: { numItems: number; offset: number };
  sortBy?: { field: string; order: "asc" | "desc" };
  pageAttributes?: Record<string, string | number>;
}

export function dySearch(params: SearchParams) {
  return post<SearchResponse>("/api/dy/search", {
    ...dyIdentity(),
    ...params,
    channel: "WEB",
    page: { type: "OTHER", data: ["SEARCH"], ...pageRef() },
  });
}

export interface MuseItem {
  sku: string;
  slotId?: string;
}

export interface MuseResponse {
  state: "ok" | "unavailable";
  assistant?: string;
  support?: boolean;
  chatId?: string;
  decisionId?: string;
  widgets?: { title?: string; items: MuseItem[] }[];
  cookies?: unknown;
}

export function dyMuse(params: { text: string; chatId?: string; pageAttributes?: Record<string, string | number> }) {
  return post<MuseResponse>("/api/dy/muse", {
    ...dyIdentity(),
    ...params,
    channel: "WEB",
    page: { type: "OTHER", data: ["MUSE"], ...pageRef() },
  });
}

// Reports a click on a search-result / Muse product slot. DY's doc: SLOT_CLICK
// with the slotId from the response; nothing to report for local results.
export function dyReportSlotClick(slotId: string | undefined) {
  if (!slotId || slotId.startsWith("local-")) return Promise.resolve(null);
  return post("/api/dy/engagement", {
    ...dyIdentity(),
    engagements: [{ type: "SLOT_CLICK", slotId }],
  });
}

export function dyEvent(name: string, properties: Record<string, unknown>) {
  return post("/api/dy/event", {
    ...dyIdentity(),
    events: [{ name, properties }],
  });
}
