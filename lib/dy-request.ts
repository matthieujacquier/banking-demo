import type { NextRequest } from "next/server";
import { SITE_URL } from "./site";

// Server-side helpers shared by the DY Search, Muse and Choose routes.

export type DYPageType = "HOMEPAGE" | "CATEGORY" | "PRODUCT" | "CART" | "OTHER";

export interface PageRef {
  type: DYPageType;
  data?: string[];
  location?: string;
  referrer?: string;
}

export interface DYIdentity {
  user: { dyid?: string; dyid_server?: string; active_consent_accepted: boolean };
  session: { dy?: string };
}

type DeviceType = "DESKTOP" | "SMARTPHONE" | "TABLET";

function deviceType(userAgent: string, channel: "WEB" | "APP"): DeviceType {
  if (channel === "APP") return "SMARTPHONE";
  if (/iPad|Tablet/i.test(userAgent)) return "TABLET";
  if (/Mobi|Android|iPhone/i.test(userAgent)) return "SMARTPHONE";
  return "DESKTOP";
}

// DY requires `page` and `device` on every serve request. pageAttributes are
// what campaigns target on (case-sensitive exact match).
export function buildContext(
  req: NextRequest,
  opts: { page: PageRef; channel?: "WEB" | "APP"; pageAttributes?: Record<string, string | number> },
) {
  const channel = opts.channel ?? "WEB";
  const userAgent = req.headers.get("user-agent") ?? "";
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const attrs = opts.pageAttributes ?? {};
  // DY rejects requests without a page location ("request must contain
  // context page location"); fall back to the referer, then the site root.
  const location = opts.page.location || req.headers.get("referer") || `${SITE_URL}/`;
  return {
    page: {
      type: opts.page.type,
      data: opts.page.data ?? [],
      location,
      referrer: opts.page.referrer ?? "",
      locale: "en_IE",
    },
    device: { userAgent, type: deviceType(userAgent, channel), ...(ip ? { ip } : {}) },
    channel,
    ...(Object.keys(attrs).length > 0 ? { pageAttributes: attrs } : {}),
  };
}

// Accepts the identity objects the clients send (the app's useDY shape and the
// public site's cookie-derived shape are the same) and normalises them.
export function identityFromBody(body: Record<string, unknown>): DYIdentity {
  const user = (body.user ?? {}) as Record<string, unknown>;
  const session = (body.session ?? {}) as Record<string, unknown>;
  const out: DYIdentity = { user: { active_consent_accepted: true }, session: {} };
  if (typeof user.dyid === "string" && user.dyid) out.user.dyid = user.dyid;
  if (typeof user.dyid_server === "string" && user.dyid_server) out.user.dyid_server = user.dyid_server;
  if (typeof session.dy === "string" && session.dy) out.session.dy = session.dy;
  return out;
}

export function pageFromBody(body: Record<string, unknown>, fallback: PageRef): PageRef {
  const page = (body.page ?? {}) as Record<string, unknown>;
  const type = typeof page.type === "string" ? (page.type as DYPageType) : fallback.type;
  return {
    type,
    data: Array.isArray(page.data) ? page.data.map(String) : fallback.data,
    location: typeof page.location === "string" ? page.location : fallback.location,
    referrer: typeof page.referrer === "string" ? page.referrer : fallback.referrer,
  };
}

export function pageAttributesFromBody(body: Record<string, unknown>): Record<string, string | number> {
  const attrs = body.pageAttributes;
  if (!attrs || typeof attrs !== "object") return {};
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(attrs as Record<string, unknown>)) {
    if (typeof v === "string" || typeof v === "number") out[k] = v;
  }
  return out;
}
