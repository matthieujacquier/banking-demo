// Product catalog — the single source of truth for the website, the app and
// the DY product feed (nexabank_product_feed.csv is generated from it with
// `npm run feed`). Products live in lib/catalog/<category>.ts; SKU values are
// what DY events (productId, slots) are keyed on, so they never change.

import { ACCOUNTS } from "./catalog/accounts";
import { CARDS } from "./catalog/cards";
import { LOANS } from "./catalog/loans";
import { SAVINGS } from "./catalog/savings";
import { INVESTMENTS } from "./catalog/investments";
import { INSURANCE } from "./catalog/insurance";
import { CRYPTO } from "./catalog/crypto";
import { CASHBACK } from "./catalog/cashback";
import { BUSINESS } from "./catalog/business";
import { PRIVATE_BANKING } from "./catalog/private-banking";
import { SERVICES } from "./catalog/services";
import type { Product, ProductCategory } from "./catalog/types";

export type {
  Product,
  ProductCategory,
  ProductInput,
  Segment,
  Tier,
  RateType,
  Liquidity,
  Persona,
  Goal,
  SpecRow,
  Faq,
} from "./catalog/types";
export { slugOf, groupIdOf } from "./catalog/types";

export const CATEGORY_ACCENT: Record<ProductCategory, string> = {
  Accounts: "#0D9488",
  Cards: "#0891B2",
  Loans: "#2563FF",
  Savings: "#16A34A",
  Investments: "#7C3AED",
  Insurance: "#EA580C",
  Crypto: "#F59E0B",
  Cashback: "#EC4899",
  Business: "#4F46E5",
  "Private Banking": "#B45309",
  Services: "#64748B",
};

export const CATEGORIES: ProductCategory[] = [
  "Accounts",
  "Cards",
  "Loans",
  "Savings",
  "Investments",
  "Insurance",
  "Crypto",
  "Cashback",
  "Business",
  "Private Banking",
  "Services",
];

export const PRODUCTS: Product[] = [
  ...ACCOUNTS,
  ...CARDS,
  ...LOANS,
  ...SAVINGS,
  ...INVESTMENTS,
  ...INSURANCE,
  ...CRYPTO,
  ...CASHBACK,
  ...BUSINESS,
  ...PRIVATE_BANKING,
  ...SERVICES,
];

// Catalog invariants — fail loudly at module load rather than drift silently.
{
  const seen = new Set<string>();
  for (const p of PRODUCTS) {
    if (seen.has(p.sku)) throw new Error(`Duplicate SKU in catalog: ${p.sku}`);
    seen.add(p.sku);
  }
  for (const p of PRODUCTS) {
    for (const sku of p.relatedSkus) {
      if (!seen.has(sku)) throw new Error(`${p.sku}: unknown related SKU ${sku}`);
    }
  }
}

export function getProduct(sku: string): Product | undefined {
  return PRODUCTS.find((p) => p.sku === sku);
}

export function productsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

// A representative monetary value for DY events fired against a product
// (Application / Submission / Purchase all need a `value`).
export function eventValue(product: Product): number {
  if (product.minAmount > 0) return product.minAmount;
  if (product.annualFee > 0) return product.annualFee;
  return 100;
}
