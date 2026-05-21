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

export async function fireLoginEvent(email: string): Promise<void> {
  const cuid = await sha256Hex(email);
  getDyApi()?.("event", {
    name: "Login",
    properties: { dyType: "login-v1", cuid, cuidType: "he" },
  });
}
