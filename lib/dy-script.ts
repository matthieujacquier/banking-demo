// Client-side DY events fired through the DY script (window.DY.API), used on
// public-site pages that load the DY script via <DYContext> — the login page
// and the sign-up / KYC flow. These do not appear in the app's server-side
// Inspector panel.

import { sha256Hex } from "./dy-user";

type DyApi = (command: string, payload: unknown) => void;

function getDyApi(): DyApi | undefined {
  if (typeof window === "undefined") return undefined;
  const dy = (window as unknown as { DY?: { API?: unknown } }).DY;
  return typeof dy?.API === "function" ? (dy.API as DyApi) : undefined;
}

// Reports an event through DY's script — the documented client-side form, so
// it is visible in the browser and in DY's debugger. Returns false when the
// script isn't on the page (blocked, or not loaded yet) so the caller can
// report the event server-side instead.
export function fireSiteEvent(name: string, properties: Record<string, unknown>): boolean {
  const api = getDyApi();
  if (!api) return false;
  api("event", { name, properties });
  return true;
}

export async function fireLoginEvent(email: string): Promise<void> {
  const cuid = await sha256Hex(email);
  getDyApi()?.("event", {
    name: "Login",
    properties: { dyType: "login-v1", cuid, cuidType: "he" },
  });
}

// Sign-up completed: identifies the new customer (hashed email) and lets DY
// attribute the acquisition to whatever campaign brought them here.
export async function fireSignupEvent(email: string, productSku?: string): Promise<void> {
  const cuid = await sha256Hex(email);
  getDyApi()?.("event", {
    name: "Signup",
    properties: { dyType: "signup-v1", cuid, cuidType: "he", ...(productSku ? { product: productSku } : {}) },
  });
}
