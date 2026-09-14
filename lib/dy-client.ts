"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDYActivity, type CallKind } from "./dy-activity";
import { applyCookies, loadIdentity, saveIdentity, sha256Hex } from "./dy-user";
import { eventValue, type Product } from "./products";
import { profileAttributes } from "./profile";
import type { SearchFilter } from "./search-local";

const API = {
  pageview: "/api/dy/pageview",
  event: "/api/dy/event",
  choose: "/api/dy/choose",
  engagement: "/api/dy/engagement",
  search: "/api/dy/search",
  muse: "/api/dy/muse",
};

export interface SearchOptions {
  filters?: SearchFilter[];
  pagination?: { numItems: number; offset: number };
  sortBy?: { field: string; order: "asc" | "desc" };
  page?: PageContext;
}

export interface PageContext {
  type: string;
  data?: string[];
}

interface CookieBearing {
  cookies?: { name: string; value: string }[];
}

// useDY exposes typed helpers for every DY interaction. Each call is recorded
// into the Inspector store (request + response + status + duration).
export function useDY() {
  const { record, update } = useDYActivity();

  const call = useCallback(
    async (kind: CallKind, title: string, api: string, body: unknown) => {
      const id = record({ kind, title, url: api, requestBody: body });
      const startedAt = performance.now();
      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json().catch(() => ({}))) as CookieBearing;
        if (Array.isArray(data?.cookies)) applyCookies(data.cookies);
        update(id, {
          responseBody: data,
          status: res.status,
          durationMs: Math.round(performance.now() - startedAt),
          state: res.ok ? "success" : "error",
        });
        return data;
      } catch (err) {
        update(id, {
          responseBody: { error: String(err) },
          durationMs: Math.round(performance.now() - startedAt),
          state: "error",
        });
        return null;
      }
    },
    [record, update],
  );

  return useMemo(() => {
    // active_consent_accepted is required for EU-originating traffic — DY
    // returns 451 (legal/GDPR gate) without it even on a US datacenter.
    const user = () => {
      const id = loadIdentity();
      const base = { active_consent_accepted: true };
      return id.dyid
        ? { ...base, dyid: id.dyid, dyid_server: id.dyidServer ?? id.dyid }
        : base;
    };
    const session = () => {
      const id = loadIdentity();
      return id.session ? { dy: id.session } : {};
    };
    const page = (ctx: PageContext) => ({
      type: ctx.type,
      location: typeof window !== "undefined" ? window.location.href : "",
      data: ctx.data ?? [],
    });
    const eventBody = (events: { name: string; properties: Record<string, unknown> }[]) => ({
      user: user(),
      session: session(),
      events,
    });
    const cartOf = (product: Product, value: number) => [
      { productId: product.sku, quantity: 1, itemPrice: value },
    ];
    const fireEvent = (
      title: string,
      name: string,
      properties: Record<string, unknown>,
    ) => call("event", `Event · ${title}`, API.event, eventBody([{ name, properties }]));

    // The app is a phone; the customer's declared financial profile rides
    // along as pageAttributes so campaigns can target on it.
    const attrs = () => {
      const a = profileAttributes();
      return Object.keys(a).length ? { pageAttributes: a } : {};
    };

    return {
      choose: (selectorNames: string[], ctx: PageContext) =>
        call("choose", `Choose · ${selectorNames.join(", ")}`, API.choose, {
          user: user(),
          session: session(),
          selector: { names: selectorNames },
          context: { page: page(ctx), device: { type: "SMARTPHONE" }, channel: "APP", ...attrs() },
          options: { returnAnalyticsMetadata: true },
        }),

      pageview: (ctx: PageContext) =>
        call("pageview", `Pageview · ${ctx.type}`, API.pageview, {
          user: user(),
          session: session(),
          context: { page: page(ctx), device: { type: "SMARTPHONE" }, channel: "APP" },
        }),

      // DY Experience Search (server route falls back to a local search when
      // the Semantic Search campaign isn't live; the response says which).
      search: (text: string, opts: SearchOptions = {}) =>
        call("search", `Search · ${text.trim() || "browse"}`, API.search, {
          user: user(),
          session: session(),
          text,
          filters: opts.filters ?? [],
          pagination: opts.pagination ?? { numItems: 24, offset: 0 },
          ...(opts.sortBy ? { sortBy: opts.sortBy } : {}),
          channel: "APP",
          page: page(opts.page ?? { type: "OTHER", data: ["SEARCH"] }),
          ...attrs(),
        }),

      // DY Shopping Muse. Omit chatId on the first turn; echo it afterwards.
      muse: (text: string, chatId?: string) =>
        call("muse", `Muse · ${text.trim()}`, API.muse, {
          user: user(),
          session: session(),
          text,
          ...(chatId ? { chatId } : {}),
          channel: "APP",
          page: page({ type: "OTHER", data: ["MUSE"] }),
          ...attrs(),
        }),

      identify: async (email: string) => {
        const cuid = await sha256Hex(email);
        saveIdentity({ cuid, email });
        return fireEvent("Identify User", "Identify User", {
          dyType: "identify-v1",
          cuid,
          cuidType: "he",
        });
      },

      login: async (email: string) => {
        const cuid = await sha256Hex(email);
        saveIdentity({ cuid, email });
        return fireEvent("Login", "Login", {
          dyType: "login-v1",
          cuid,
          cuidType: "he",
        });
      },

      applicationStarted: (product: Product) => {
        const value = eventValue(product);
        return fireEvent("Application Started", "Application Started", {
          dyType: "add-to-cart-v1",
          value,
          currency: "EUR",
          productId: product.sku,
          quantity: 1,
          cart: cartOf(product, value),
        });
      },

      submission: (product: Product) => {
        const value = eventValue(product);
        return fireEvent("Submission", "Submission", {
          dyType: "purchase-v1",
          value,
          currency: "EUR",
          uniqueTransactionId: `sub-${product.sku}-${Date.now()}`,
          cart: cartOf(product, value),
        });
      },

      purchase: (product: Product, value?: number) => {
        const total = value ?? eventValue(product);
        return fireEvent("Purchase", "Purchase", {
          dyType: "purchase-v1",
          value: total,
          currency: "EUR",
          uniqueTransactionId: `pur-${product.sku}-${Date.now()}`,
          cart: cartOf(product, total),
        });
      },

      keywordSearch: (keywords: string) =>
        fireEvent("Keyword Search", "Keyword Search", {
          dyType: "keyword-search-v1",
          keywords,
        }),

      // Attribute names must match feed columns (categories, goals, personas…);
      // DY accepts at most 10 values per attribute.
      informAffinity: (input: string[] | { attribute: string; values: string[] }[]) => {
        const data = (
          input.length > 0 && typeof input[0] === "string"
            ? [{ attribute: "categories", values: input as string[] }]
            : (input as { attribute: string; values: string[] }[])
        )
          .filter((d) => d.values.length > 0)
          .map((d) => ({ attribute: d.attribute, values: d.values.slice(0, 10) }));
        return fireEvent("Inform Affinity", "Inform Affinity", {
          dyType: "inform-affinity-v1",
          source: "app-preferences",
          data,
        });
      },

      timeOnCategory: (category: string, durationMs: number) =>
        fireEvent("Time on Category", "Time on Category", {
          category,
          durationMs,
        }),

      event: (title: string, name: string, properties: Record<string, unknown>) =>
        fireEvent(title, name, properties),

      reportEngagement: (
        type: "IMP" | "CLICK" | "SLOT_IMP" | "SLOT_CLICK",
        ids: { decisionId?: string; slotId?: string },
      ) =>
        call("engagement", `Engagement · ${type}`, API.engagement, {
          user: user(),
          session: session(),
          engagements: [{ type, ...ids }],
        }),
    };
  }, [call]);
}

// Fires a single server-side pageview when an app screen mounts.
export function useDYPageview(type: string, data?: string[]) {
  const dy = useDY();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    dy.pageview({ type, data });
  }, [dy, type, data]);
}
