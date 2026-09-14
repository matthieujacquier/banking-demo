// The customer's self-declared financial profile (set on the app's Profile
// screen). Sent to DY as context.pageAttributes on choose / search / Muse
// calls so campaigns can target on it, and used for the "Use my profile"
// toggle in the Muse assistant.

import type { Goal, Persona } from "./products";

export type Household = "single" | "couple" | "family";

export interface FinancialProfile {
  riskAppetite?: number; // 1-10
  lifeStage?: Persona;
  goals?: Goal[];
  household?: Household;
  interests?: string[]; // product categories
}

const KEY = "nexabank_profile";

export function loadProfile(): FinancialProfile {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as FinancialProfile;
  } catch {
    return {};
  }
}

export function saveProfile(patch: Partial<FinancialProfile>): FinancialProfile {
  const next = { ...loadProfile(), ...patch };
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

// Flat key/values for DY pageAttributes (strings or numbers only).
export function profileAttributes(profile: FinancialProfile = loadProfile()): Record<string, string | number> {
  const attrs: Record<string, string | number> = {};
  if (profile.riskAppetite) attrs.riskAppetite = profile.riskAppetite;
  if (profile.lifeStage) attrs.lifeStage = profile.lifeStage;
  if (profile.goals?.length) attrs.goals = profile.goals.join("|");
  if (profile.household) attrs.household = profile.household;
  return attrs;
}

// A compact, human-readable context line (≤ ~90 chars) the Muse assistant can
// append to a prompt when the customer opts in.
export function profileContextLine(profile: FinancialProfile = loadProfile()): string {
  const parts: string[] = [];
  if (profile.riskAppetite) parts.push(`risk appetite ${profile.riskAppetite}/10`);
  if (profile.goals?.length) parts.push(`goals: ${profile.goals.slice(0, 3).join(", ")}`);
  if (profile.lifeStage) parts.push(`life stage: ${profile.lifeStage.replace(/_/g, " ")}`);
  if (profile.household) parts.push(`household: ${profile.household}`);
  return parts.length ? `Context: ${parts.join("; ")}.` : "";
}
