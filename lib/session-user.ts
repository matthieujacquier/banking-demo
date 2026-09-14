// The signed-in demo customer (sessionStorage). There is no login wall: any
// email signs you in, and a deep link into /app signs in the default customer.

export interface SessionUser {
  name: string;
  email: string;
}

const KEY = "nexabank_user";

export const DEFAULT_USER: SessionUser = { name: "Matthieu Jacquier", email: "matthieu.jacquier@mastercard.com" };

export const DEMO_USERS: SessionUser[] = [DEFAULT_USER, { name: "Jane Smith", email: "jane.smith@demo.com" }];

export function readSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const u = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Partial<SessionUser> | null;
    return u && typeof u.email === "string" && typeof u.name === "string" ? { name: u.name, email: u.email } : null;
  } catch {
    return null;
  }
}

export function writeSessionUser(user: SessionUser): SessionUser {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
  return user;
}

export function ensureSessionUser(): SessionUser {
  return readSessionUser() ?? writeSessionUser(DEFAULT_USER);
}

export function clearSessionUser() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

// "jane.doe@example.com" → "Jane Doe"; a known demo address keeps its name.
export function userFromEmail(email: string): SessionUser {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return DEFAULT_USER;
  const known = DEMO_USERS.find((u) => u.email.toLowerCase() === trimmed);
  if (known) return known;
  const local = trimmed.split("@")[0] ?? "";
  const name = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { name: name || "NexaBank Customer", email: trimmed };
}
