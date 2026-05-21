// DY identity for the app section's server-side calls. The first choose /
// pageview response returns cookies (_dyid_server, _dyjsession) which we
// persist and attach to every subsequent call. The logged-in customer is
// identified by a SHA-256 hash of their email (cuidType "he").

export interface DYIdentity {
  dyid?: string;
  dyidServer?: string;
  session?: string;
  cuid?: string;
  email?: string;
}

const KEY = "nexabank_dy_identity";

export function loadIdentity(): DYIdentity {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as DYIdentity;
  } catch {
    return {};
  }
}

export function saveIdentity(patch: Partial<DYIdentity>): DYIdentity {
  const next = { ...loadIdentity(), ...patch };
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export function applyCookies(cookies: { name: string; value: string }[]): void {
  const patch: Partial<DYIdentity> = {};
  for (const c of cookies) {
    if (c.name === "_dyid_server" || c.name === "_dyid") {
      patch.dyid = c.value;
      patch.dyidServer = c.value;
    }
    if (c.name === "_dyjsession") patch.session = c.value;
  }
  if (Object.keys(patch).length) saveIdentity(patch);
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
