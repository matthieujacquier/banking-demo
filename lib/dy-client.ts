"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDYActivity, type CallKind } from "./dy-activity";
import { applyCookies, loadIdentity, saveIdentity, sha256Hex } from "./dy-user";
import { eventValue, type Product } from "./products";

const API = {
  choose: "/api/dy/choose",
  pageview: "/api/dy/pageview",
  event: "/api/dy/event",
  engagement: "/api/dy/engagement",
};

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
    const user = () => {
      const id = loadIdentity();
      return id.dyid ? { dyid: id.dyid, dyid_server: id.dyidServer ?? id.dyid } : {};
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

    return {
      choose: (selectorNames: string[], ctx: PageContext) =>
        call("choose", `Choose · ${selectorNames.join(", ")}`, API.choose, {
          user: user(),
          session: session(),
          selector: { names: selectorNames },
          context: { page: page(ctx), device: { type: "DESKTOP" } },
          options: {
            isImplicitImpressionMode: true,
            isImplicitPageview: false,
            returnAnalyticsMetadata: true,
          },
        }),

      pageview: (ctx: PageContext) =>
        call("pageview", `Pageview · ${ctx.type}`, API.pageview, {
          user: user(),
          session: session(),
          context: { page: page(ctx), device: { type: "DESKTOP" } },
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

      informAffinity: (categories: string[]) =>
        fireEvent("Inform Affinity", "Inform Affinity", {
          dyType: "inform-affinity-v1",
          source: "app-preferences",
          data: [{ attribute: "categories", values: categories }],
        }),

      reportEngagement: (
        type: "IMP" | "SLOT_IMP" | "SLOT_CLICK" | "CLICK",
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
