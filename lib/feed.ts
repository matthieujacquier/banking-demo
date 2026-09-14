// Dynamic Yield product feed, generated from lib/products.ts.
// Column semantics are documented in FEED_SCHEMA.md; validateFeed() enforces
// them so a feed that would fail DY's sync (or silently drift from the site)
// never gets written.

import { CATEGORIES, PRODUCTS, groupIdOf, type Product } from "./products";
import { CATEGORY_CONFIG } from "./catalog-config";
import {
  GOAL_VALUES,
  LIQUIDITY_VALUES,
  PERSONA_VALUES,
  RATE_TYPE_VALUES,
  SEGMENT_VALUES,
  TIER_VALUES,
} from "./catalog/types";

import { SITE_URL } from "./site";

export { SITE_URL };

export type Cell = string | number | boolean | string[];

interface Column {
  name: string;
  value: (p: Product) => Cell;
}

const faqCell = (p: Product) => p.faq.map((f) => `${f.q} => ${f.a}`).join(" || ");

// DY order: the 8 mandatory columns, then the columns that existed in the
// original feed (names unchanged — DY never lets you remove a column), then
// the new ones.
export const FEED_COLUMNS: Column[] = [
  { name: "sku", value: (p) => p.sku },
  { name: "group_id", value: (p) => groupIdOf(p) },
  { name: "name", value: (p) => p.name },
  { name: "url", value: (p) => SITE_URL + p.url },
  { name: "price", value: (p) => p.price },
  { name: "in_stock", value: (p) => p.inStock },
  { name: "image_url", value: (p) => SITE_URL + p.imageUrl },
  { name: "categories", value: (p) => [p.category, p.subcategory, p.shortName ?? p.name] },
  { name: "keywords", value: (p) => p.keywords },
  { name: "description", value: (p) => p.description },
  { name: "dy_display_price", value: (p) => p.displayPrice },
  { name: "life_stage", value: (p) => p.lifeStage },
  { name: "product_type", value: (p) => p.productType },
  { name: "type:number:annual_fee", value: (p) => p.annualFee },
  { name: "type:number:cashback_percent", value: (p) => p.cashbackPercent },
  { name: "type:number:interest_rate", value: (p) => p.interestRate },
  { name: "type:number:max_amount", value: (p) => p.maxAmount },
  { name: "type:number:min_amount", value: (p) => p.minAmount },
  { name: "type:number:risk_level", value: (p) => p.riskLevel },
  { name: "type:number:term_months", value: (p) => p.termMonths },
  { name: "brand", value: () => "NexaBank" },
  { name: "tagline", value: (p) => p.tagline },
  { name: "long_description", value: (p) => p.longDescription },
  { name: "segment", value: (p) => p.segment },
  { name: "tier", value: (p) => p.tier },
  { name: "badge", value: (p) => p.badge ?? "" },
  { name: "rate_type", value: (p) => p.rateType },
  { name: "liquidity", value: (p) => p.liquidity },
  { name: "fee_summary", value: (p) => p.feeSummary },
  { name: "regulatory_note", value: (p) => p.regulatoryNote },
  { name: "faq", value: faqCell },
  { name: "type:array:features", value: (p) => p.features },
  { name: "type:array:eligibility", value: (p) => p.eligibility },
  { name: "type:array:perks", value: (p) => p.perks },
  { name: "type:array:personas", value: (p) => p.personas },
  { name: "type:array:goals", value: (p) => p.goals },
  { name: "type:array:related_skus", value: (p) => p.relatedSkus },
  { name: "type:number:monthly_fee", value: (p) => p.monthlyFee },
  { name: "type:number:aer", value: (p) => p.aer },
  { name: "type:number:expected_return_min", value: (p) => p.expectedReturnMin },
  { name: "type:number:expected_return_max", value: (p) => p.expectedReturnMax },
  { name: "type:number:annual_fee_pct", value: (p) => p.annualFeePct },
  { name: "type:number:transaction_fee_pct", value: (p) => p.transactionFeePct },
  { name: "type:number:fx_fee_pct", value: (p) => p.fxFeePct },
  { name: "type:number:cashback_monthly_cap", value: (p) => p.cashbackMonthlyCap },
  { name: "type:number:min_term_months", value: (p) => p.minTermMonths },
  { name: "type:number:notice_days", value: (p) => p.noticeDays },
  { name: "type:number:min_age", value: (p) => p.minAge },
  { name: "type:number:min_income", value: (p) => p.minIncome },
  { name: "type:number:customer_rating", value: (p) => p.customerRating },
  { name: "type:number:review_count", value: (p) => p.reviewCount },
  { name: "type:number:popularity_score", value: (p) => p.popularityScore },
  { name: "type:date:launched_at", value: (p) => p.launchedAt },
];

export const FEED_HEADER = FEED_COLUMNS.map((c) => c.name);

export function feedRows(products: Product[] = PRODUCTS): Cell[][] {
  return products.map((p) => FEED_COLUMNS.map((c) => c.value(p)));
}

export function cellToString(cell: Cell): string {
  if (Array.isArray(cell)) return cell.join("|");
  if (typeof cell === "boolean") return cell ? "true" : "false";
  return String(cell);
}

// RFC 4180: quote when the value contains a comma, a quote or a line break;
// double any inner quotes.
export function csvEscape(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(rows: Cell[][], header: string[] = FEED_HEADER): string {
  const lines = [header, ...rows.map((r) => r.map(cellToString))].map((r) => r.map(csvEscape).join(","));
  return lines.join("\n") + "\n";
}

export function buildFeedCsv(products: Product[] = PRODUCTS): string {
  return toCsv(feedRows(products));
}

// ── Validation ───────────────────────────────────────────────────────────────

const ENUM_COLUMNS: Record<string, readonly string[]> = {
  life_stage: PERSONA_VALUES,
  "type:array:personas": PERSONA_VALUES,
  "type:array:goals": GOAL_VALUES,
  segment: SEGMENT_VALUES,
  tier: TIER_VALUES,
  rate_type: RATE_TYPE_VALUES,
  liquidity: LIQUIDITY_VALUES,
};

const PERCENT_COLUMNS = new Set([
  "type:number:cashback_percent",
  "type:number:interest_rate",
  "type:number:aer",
  "type:number:expected_return_min",
  "type:number:expected_return_max",
  "type:number:annual_fee_pct",
  "type:number:transaction_fee_pct",
  "type:number:fx_fee_pct",
]);

const HEADER_RE = /^(type:(number|array|date):)?[a-z0-9_]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const MAX_CELL = 1000;

export interface ValidateOptions {
  // Return true when a site-relative asset (e.g. "/images/products/x.png") exists.
  fileExists?: (relativePath: string) => boolean;
}

export function validateFeed(
  rows: Cell[][] = feedRows(),
  header: string[] = FEED_HEADER,
  options: ValidateOptions = {},
): string[] {
  const errors: string[] = [];
  const err = (row: number, col: string, msg: string) => errors.push(`row ${row + 1} [${col}]: ${msg}`);

  for (const h of header) {
    if (!HEADER_RE.test(h)) errors.push(`header "${h}" is not a valid DY column name`);
  }
  const bareNames = header.map((h) => h.replace(/^type:(number|array|date):/, ""));
  if (new Set(bareNames).size !== bareNames.length) errors.push("duplicate column names (type prefixes are ignored by DY)");

  const col = (name: string) => header.indexOf(name);
  const skus = new Set<string>();
  const allSkus = new Set(rows.map((r) => String(r[col("sku")])));

  rows.forEach((row, i) => {
    header.forEach((name, j) => {
      const raw = row[j];
      const text = cellToString(raw);
      if (text.length > MAX_CELL) err(i, name, `cell is ${text.length} chars (max ${MAX_CELL})`);

      if (name.startsWith("type:number:") || name === "price") {
        if (typeof raw !== "number" || !Number.isFinite(raw)) err(i, name, "must be a finite number, never empty");
        else if (raw < 0) err(i, name, "negative numbers do not sync");
        if (name === "type:number:risk_level" && (raw as number) < 1) err(i, name, "risk_level must be 1-10");
        if (name === "type:number:risk_level" && (raw as number) > 10) err(i, name, "risk_level must be 1-10");
        if (name === "type:number:customer_rating" && (raw as number) > 5) err(i, name, "rating must be 0-5");
        if (name === "type:number:popularity_score" && ((raw as number) < 1 || (raw as number) > 100))
          err(i, name, "popularity_score must be 1-100");
        if (PERCENT_COLUMNS.has(name) && (raw as number) > 100) err(i, name, "percentages must be 0-100");
      }
      if (name.startsWith("type:date:") && !DATE_RE.test(text)) err(i, name, "date must be yyyy-mm-ddThh:mm:ss");
      if (name.startsWith("type:array:") || name === "keywords" || name === "categories") {
        if (!Array.isArray(raw)) err(i, name, "must be an array");
        else if (raw.some((v) => v.includes("|"))) err(i, name, "array items must not contain '|'");
      }
      const allowed = ENUM_COLUMNS[name];
      if (allowed) {
        const values = Array.isArray(raw) ? raw : [text];
        for (const v of values) if (!allowed.includes(v)) err(i, name, `"${v}" is not one of ${allowed.join("|")}`);
      }
    });

    const sku = String(row[col("sku")]);
    if (/\s|\/\//.test(sku)) err(i, "sku", "must not contain spaces or //");
    if (skus.has(sku)) err(i, "sku", "duplicate");
    skus.add(sku);

    const url = String(row[col("url")]);
    const image = String(row[col("image_url")]);
    if (!/^https?:\/\//.test(url)) err(i, "url", "must be an absolute http(s) URL");
    if (!/^https?:\/\//.test(image)) err(i, "image_url", "must be an absolute http(s) URL");
    if (cellToString(row[col("in_stock")]) !== "true" && cellToString(row[col("in_stock")]) !== "false")
      err(i, "in_stock", "must be lowercase true/false");

    const categories = row[col("categories")];
    if (Array.isArray(categories)) {
      if (categories.length !== 3) err(i, "categories", "must be Category|Subcategory|Name");
      if (!(CATEGORIES as string[]).includes(categories[0])) err(i, "categories", `unknown category ${categories[0]}`);
      const cfg = CATEGORY_CONFIG[categories[0] as keyof typeof CATEGORY_CONFIG];
      if (cfg && !url.startsWith(`${SITE_URL}/products/${cfg.routeSlug}/`))
        err(i, "url", `does not match the ${categories[0]} route`);
    }

    const related = row[col("type:array:related_skus")];
    if (Array.isArray(related)) for (const r of related) if (!allSkus.has(r)) err(i, "type:array:related_skus", `unknown SKU ${r}`);

    if (options.fileExists) {
      const rel = image.replace(SITE_URL, "");
      if (!options.fileExists(rel)) err(i, "image_url", `${rel} does not exist under public/`);
    }
  });

  return errors;
}
