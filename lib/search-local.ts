// Local fallback for DY Experience Search. Used by /api/dy/search when the
// Semantic Search campaign isn't live yet (or DY errors), so the demo never
// shows an empty results page. Deterministic, runs over lib/products.ts, and
// returns the exact shape of a DY SEMANTIC_SEARCH_DECISION payload.

import { PRODUCTS, type Product } from "./products";
import { GOAL_LABEL, PERSONA_LABEL } from "./catalog-config";

export interface SearchFilter {
  field: string;
  values?: string[];
  min?: number;
  max?: number;
}

export interface SearchQuery {
  text: string;
  filters?: SearchFilter[];
  pagination?: { numItems: number; offset: number };
  sortBy?: { field: string; order: "asc" | "desc" };
  enableSpellCheck?: boolean;
}

export interface FacetString {
  column: string;
  valuesType: "string";
  displayName: string;
  values: { name: string; count: number }[];
}

export interface FacetNumber {
  column: string;
  valuesType: "number";
  displayName: string;
  min: number;
  max: number;
}

export type Facet = FacetString | FacetNumber;

export interface SearchData {
  totalNumResults: number;
  facets: Facet[];
  slots: { slotId: string; sku: string }[];
  searchQuery: string;
  normalizedQuery: string;
  spellCheckedQuery?: string;
}

const STOPWORDS = new Set([
  "a", "an", "the", "for", "my", "me", "i", "to", "of", "and", "with", "in", "on", "is", "am", "are", "want", "need",
  "looking", "some", "best", "good", "which", "what", "should", "get", "have", "do", "can", "you", "your", "our", "we",
  "that", "this", "it", "as", "at", "be", "or", "bit", "little",
]);

// Query-intent synonyms → words that appear in the catalog.
const SYNONYMS: Record<string, string[]> = {
  kid: ["kids", "child", "children", "junior"],
  kids: ["child", "children", "junior", "pocket"],
  child: ["kids", "children", "junior"],
  children: ["kids", "child", "junior"],
  son: ["kids", "child", "junior"],
  daughter: ["kids", "child", "junior"],
  teen: ["teenager", "teens", "kids"],
  teenager: ["teen", "teens"],
  baby: ["family", "child", "life"],
  family: ["joint", "children", "household"],
  married: ["joint", "family", "couple"],
  couple: ["joint", "family"],
  wife: ["joint", "family"],
  husband: ["joint", "family"],
  retire: ["retirement", "pension"],
  retirement: ["pension", "retire"],
  pension: ["retirement"],
  old: ["retirement", "pension"],
  safe: ["guaranteed", "protected", "regulated", "deposit", "fixed"],
  secure: ["guaranteed", "protected", "regulated"],
  guaranteed: ["fixed", "term", "regulated"],
  risky: ["crypto", "volatile"],
  cheap: ["free", "low cost", "no fee"],
  free: ["no fee", "€0"],
  business: ["company", "sole trader", "invoice", "merchant"],
  company: ["business"],
  startup: ["business"],
  shop: ["merchant", "terminal", "payments"],
  house: ["home", "mortgage", "property"],
  home: ["house", "mortgage", "property"],
  flat: ["apartment", "home", "mortgage"],
  apartment: ["home", "mortgage", "property"],
  mortgage: ["real estate", "home loan", "property"],
  car: ["vehicle", "auto"],
  vehicle: ["car", "auto"],
  travel: ["holiday", "trip", "abroad", "fx", "currency"],
  holiday: ["travel", "trip", "abroad"],
  abroad: ["travel", "fx", "currency", "foreign"],
  invest: ["investment", "investing", "portfolio", "fund"],
  investing: ["investment", "portfolio", "fund"],
  investment: ["portfolio", "fund"],
  stocks: ["etf", "shares", "market"],
  shares: ["etf", "stocks"],
  crypto: ["bitcoin", "ethereum", "digital asset"],
  bitcoin: ["crypto", "btc"],
  student: ["university", "education", "study"],
  university: ["student", "education"],
  study: ["student", "education"],
  loan: ["borrow", "financing", "credit"],
  borrow: ["loan", "credit"],
  debt: ["consolidation", "loan", "credit"],
  card: ["credit card", "cashback"],
  cashback: ["rewards", "card"],
  rewards: ["cashback", "loyalty"],
  save: ["savings", "saver", "pots"],
  saving: ["savings", "saver", "pots"],
  savings: ["saver", "pots", "deposit"],
  interest: ["aer", "rate", "savings"],
  insurance: ["cover", "protection", "policy"],
  insure: ["insurance", "cover", "protection"],
  protect: ["insurance", "cover", "protection"],
  health: ["income protection", "life"],
  dog: ["pet"],
  cat: ["pet"],
  pet: ["dog", "cat"],
  green: ["sustainable", "esg", "solar", "energy"],
  eco: ["sustainable", "esg", "green"],
  ethical: ["sustainable", "esg"],
  solar: ["green", "energy"],
  advice: ["advisor", "coaching", "consultation", "planning"],
  advisor: ["advice", "coaching", "consultation"],
  help: ["coaching", "advice", "support"],
  budget: ["budgeting", "coaching", "pots"],
  premium: ["prestige", "concierge", "exclusive"],
  luxury: ["prestige", "private banking", "concierge"],
  rich: ["private banking", "wealth", "hnw"],
  wealth: ["private banking", "planning"],
  euro: ["currency", "fx", "exchange"],
  dollars: ["currency", "fx", "exchange", "usd"],
  currency: ["fx", "exchange"],
  lounge: ["travel", "nomad"],
  overdraft: ["student", "account"],
  account: ["current account", "everyday"],
  bank: ["account", "everyday"],
};

export function normalizeQuery(text: string): string {
  return text.replace(/[%/\\|;:<>]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(text: string): string[] {
  return normalizeQuery(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}€%\s-]/gu, " ")
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
}

interface Doc {
  product: Product;
  name: string;
  strong: string; // tagline + keywords + type + category
  weak: string; // features, perks, descriptions
  personas: string;
  goals: string;
}

const DOCS: Doc[] = PRODUCTS.map((p) => ({
  product: p,
  name: `${p.name} ${p.shortName ?? ""}`.toLowerCase(),
  strong: [p.tagline, ...p.keywords, p.productType, p.category, p.subcategory].join(" ").toLowerCase(),
  weak: [...p.features, ...p.perks, p.cardDescription, p.description, p.longDescription].join(" ").toLowerCase(),
  personas: p.personas.map((x) => `${x} ${PERSONA_LABEL[x]}`).join(" ").toLowerCase(),
  goals: p.goals.map((x) => `${x} ${GOAL_LABEL[x]}`).join(" ").toLowerCase(),
}));

// Vocabulary for spell correction: every word that appears in a product name,
// keyword or tagline.
const VOCAB: Set<string> = new Set(
  DOCS.flatMap((d) => (d.name + " " + d.strong).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 4)),
);

function editDistanceLE1(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function known(token: string): boolean {
  if (VOCAB.has(token)) return true;
  // Plurals and simple inflections of known words are not typos.
  if (token.endsWith("s") && VOCAB.has(token.slice(0, -1))) return true;
  if (token.endsWith("es") && VOCAB.has(token.slice(0, -2))) return true;
  if (token.endsWith("ing") && VOCAB.has(token.slice(0, -3))) return true;
  return false;
}

// One insertion / deletion / substitution, or one adjacent transposition
// ("travle" → "travel"), keeping the first letter — mirrors DY's spellchecker.
function correct(token: string): string | null {
  if (token.length < 5 || known(token)) return null;
  for (let i = 0; i < token.length - 1; i++) {
    const swapped = token.slice(0, i) + token[i + 1] + token[i] + token.slice(i + 2);
    if (swapped !== token && VOCAB.has(swapped) && swapped[0] === token[0]) return swapped;
  }
  for (const w of VOCAB) if (w[0] === token[0] && editDistanceLE1(token, w)) return w;
  return null;
}

// The query as the user typed it, with corrected words substituted.
function substitute(normalizedQuery: string, fixes: Map<string, string>): string {
  return normalizedQuery
    .split(/(\s+)/)
    .map((part) => {
      const key = part.toLowerCase().replace(/[^\p{L}\p{N}€%-]/gu, "");
      const fix = fixes.get(key);
      return fix ? part.replace(new RegExp(key, "i"), fix) : part;
    })
    .join("");
}

function expand(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const t of tokens) for (const s of SYNONYMS[t] ?? []) out.add(s);
  return [...out];
}

function contains(hay: string, needle: string): boolean {
  return hay.includes(needle);
}

function score(doc: Doc, tokens: string[], original: string[], phrase: string): number {
  let s = 0;
  if (phrase.length >= 4 && doc.name.includes(phrase)) s += 12;
  for (const t of tokens) {
    const isOriginal = original.includes(t);
    const w = isOriginal ? 1 : 0.6; // synonyms count a little less than the user's own words
    if (contains(doc.name, t)) s += 4 * w;
    if (contains(doc.strong, t)) s += 3 * w;
    if (contains(doc.personas, t)) s += 2 * w;
    if (contains(doc.goals, t)) s += 2 * w;
    if (contains(doc.weak, t)) s += 1 * w;
  }
  return s;
}

// ── Columns ──────────────────────────────────────────────────────────────────

function bare(field: string): string {
  return field.replace(/^type:(number|array|date):/, "");
}

const NUMERIC: Record<string, (p: Product) => number> = {
  price: (p) => p.price,
  annual_fee: (p) => p.annualFee,
  monthly_fee: (p) => p.monthlyFee,
  interest_rate: (p) => p.interestRate,
  aer: (p) => p.aer,
  expected_return_min: (p) => p.expectedReturnMin,
  expected_return_max: (p) => p.expectedReturnMax,
  annual_fee_pct: (p) => p.annualFeePct,
  transaction_fee_pct: (p) => p.transactionFeePct,
  fx_fee_pct: (p) => p.fxFeePct,
  cashback_percent: (p) => p.cashbackPercent,
  cashback_monthly_cap: (p) => p.cashbackMonthlyCap,
  min_amount: (p) => p.minAmount,
  max_amount: (p) => p.maxAmount,
  min_term_months: (p) => p.minTermMonths,
  term_months: (p) => p.termMonths,
  notice_days: (p) => p.noticeDays,
  risk_level: (p) => p.riskLevel,
  min_age: (p) => p.minAge,
  min_income: (p) => p.minIncome,
  customer_rating: (p) => p.customerRating,
  review_count: (p) => p.reviewCount,
  popularity_score: (p) => p.popularityScore,
  popularity: (p) => p.popularityScore,
};

const STRINGS: Record<string, (p: Product) => string[]> = {
  categories: (p) => [p.category, p.subcategory, p.shortName ?? p.name],
  category: (p) => [p.category],
  subcategory: (p) => [p.subcategory],
  segment: (p) => [p.segment],
  tier: (p) => [p.tier],
  liquidity: (p) => [p.liquidity],
  rate_type: (p) => [p.rateType],
  life_stage: (p) => [p.lifeStage],
  personas: (p) => p.personas,
  goals: (p) => p.goals,
  product_type: (p) => [p.productType],
  badge: (p) => (p.badge ? [p.badge] : []),
  sku: (p) => [p.sku],
};

function matchesFilter(p: Product, f: SearchFilter): boolean {
  const key = bare(f.field);
  if (f.values && f.values.length > 0) {
    const get = STRINGS[key];
    if (!get) return true;
    const have = get(p).map((v) => v.toLowerCase());
    return f.values.some((v) => have.includes(v.toLowerCase()));
  }
  const num = NUMERIC[key];
  if (!num) return true;
  const v = num(p);
  if (typeof f.min === "number" && v < f.min) return false;
  if (typeof f.max === "number" && v > f.max) return false;
  return true;
}

function facetString(column: string, displayName: string, products: Product[], get: (p: Product) => string[]): FacetString {
  const counts = new Map<string, number>();
  for (const p of products) for (const v of new Set(get(p))) counts.set(v, (counts.get(v) ?? 0) + 1);
  return {
    column,
    valuesType: "string",
    displayName,
    values: [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count })),
  };
}

function facetNumber(column: string, displayName: string, products: Product[], get: (p: Product) => number): FacetNumber {
  const vs = products.map(get);
  return { column, valuesType: "number", displayName, min: Math.min(...vs), max: Math.max(...vs) };
}

export function localFacets(products: Product[]): Facet[] {
  if (products.length === 0) return [];
  return [
    facetString("categories", "Category", products, (p) => [p.category]),
    facetString("segment", "Segment", products, (p) => [p.segment]),
    facetString("type:array:personas", "Who it's for", products, (p) => p.personas),
    facetString("type:array:goals", "Goal", products, (p) => p.goals),
    facetString("liquidity", "Access", products, (p) => [p.liquidity]),
    facetNumber("type:number:risk_level", "Risk level", products, (p) => p.riskLevel),
    facetNumber("type:number:aer", "Interest earned (AER %)", products, (p) => p.aer),
    facetNumber("price", "Annual cost (€)", products, (p) => p.price),
  ];
}

export function localSearch(query: SearchQuery): SearchData {
  const searchQuery = query.text ?? "";
  const normalizedQuery = normalizeQuery(searchQuery);
  const original = tokenize(normalizedQuery);

  // Spell correction (only when enabled, only for tokens that match nothing).
  let corrected: string[] = original;
  let spellCheckedQuery: string | undefined;
  if (query.enableSpellCheck !== false && original.length > 0) {
    const fixes = new Map<string, string>();
    corrected = original.map((t) => {
      const c = correct(t);
      if (c) fixes.set(t, c);
      return c ?? t;
    });
    if (fixes.size > 0) spellCheckedQuery = substitute(normalizedQuery, fixes);
  }
  const tokens = expand(corrected);
  const phrase = corrected.join(" ");

  let candidates = DOCS.filter((d) => (query.filters ?? []).every((f) => matchesFilter(d.product, f)));

  let ranked: { doc: Doc; score: number }[];
  if (corrected.length === 0) {
    ranked = candidates.map((doc) => ({ doc, score: 0 }));
  } else {
    ranked = candidates.map((doc) => ({ doc, score: score(doc, tokens, corrected, phrase) })).filter((r) => r.score > 0);
    candidates = ranked.map((r) => r.doc);
  }

  const sort = query.sortBy;
  if (sort && NUMERIC[bare(sort.field)]) {
    const get = NUMERIC[bare(sort.field)];
    const dir = sort.order === "asc" ? 1 : -1;
    ranked.sort((a, b) => dir * (get(a.doc.product) - get(b.doc.product)) || b.score - a.score);
  } else {
    ranked.sort(
      (a, b) => b.score - a.score || b.doc.product.popularityScore - a.doc.product.popularityScore || a.doc.product.name.localeCompare(b.doc.product.name),
    );
  }

  const numItems = Math.max(1, Math.min(100, query.pagination?.numItems ?? 24));
  const offset = Math.max(0, query.pagination?.offset ?? 0);
  const page = ranked.slice(offset, offset + numItems);

  return {
    totalNumResults: ranked.length,
    facets: localFacets(candidates.map((d) => d.product)),
    slots: page.map((r) => ({ slotId: `local-${r.doc.product.sku}`, sku: r.doc.product.sku })),
    searchQuery,
    normalizedQuery,
    ...(spellCheckedQuery ? { spellCheckedQuery } : {}),
  };
}

// Autosuggest for the navbar search box: product names first, then keyword
// phrases that start with the query.
export function suggest(text: string, limit = 6): { label: string; url: string; sku?: string }[] {
  const q = text.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: { label: string; url: string; sku?: string }[] = [];
  const seen = new Set<string>();
  for (const p of PRODUCTS) {
    const name = (p.shortName ?? p.name).toLowerCase();
    if (name.startsWith(q) || p.name.toLowerCase().includes(q)) {
      out.push({ label: p.name, url: p.url, sku: p.sku });
      seen.add(p.sku);
    }
  }
  for (const p of PRODUCTS) {
    if (seen.has(p.sku)) continue;
    const kw = p.keywords.find((k) => k.toLowerCase().startsWith(q));
    if (kw) {
      out.push({ label: `${kw} · ${p.name}`, url: p.url, sku: p.sku });
      seen.add(p.sku);
    }
  }
  return out.slice(0, limit);
}
