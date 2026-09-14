// Local "suggested for you" — the fallback the app Home screen shows until
// the DY "App Home Recommendations" campaign is live. Scores products against
// the customer's declared financial profile and what they already hold.

import { PRODUCTS, type Product } from "./products";
import type { FinancialProfile } from "./profile";

export function recommendForProfile(profile: FinancialProfile, exclude: string[] = [], limit = 3): Product[] {
  const held = new Set(exclude);
  const risk = profile.riskAppetite ?? 5;
  const goals = new Set(profile.goals ?? []);
  const interests = new Set(profile.interests ?? []);

  return PRODUCTS.filter((p) => !held.has(p.sku) && p.segment !== "business")
    .map((p) => {
      let score = p.popularityScore / 100;
      if (profile.lifeStage && p.personas.includes(profile.lifeStage)) score += 3;
      if (p.personas.includes("all")) score += 0.5;
      for (const g of p.goals) if (goals.has(g)) score += 2;
      if (interests.has(p.category)) score += 1.5;
      if (p.category === "Investments" || p.category === "Crypto") {
        // Investments should sit at or below the declared risk appetite.
        if (p.riskLevel <= risk) score += 1.5;
        else score -= (p.riskLevel - risk) * 1.5;
      }
      if (profile.household === "family" && p.segment === "kids") score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || b.p.popularityScore - a.p.popularityScore)
    .slice(0, limit)
    .map((x) => x.p);
}
