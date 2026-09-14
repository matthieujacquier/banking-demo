// Product model shared by the website, the app and the DY feed generator.
// Every numeric field follows the comparable schema documented in
// FEED_SCHEMA.md: one concept → one field → one unit, identical meaning on
// every product, 0 = "none / not applicable / no cap" (never left empty).

export type ProductCategory =
  | "Accounts"
  | "Cards"
  | "Loans"
  | "Savings"
  | "Investments"
  | "Insurance"
  | "Crypto"
  | "Cashback"
  | "Business"
  | "Private Banking"
  | "Services";

export type Segment = "personal" | "business" | "kids" | "private";
export type Tier = "free" | "essential" | "travel" | "premium" | "standard" | "private" | "na";
export type RateType = "fixed" | "variable" | "none";
export type Liquidity = "instant" | "notice" | "term" | "retirement" | "na";
export type Persona =
  | "all"
  | "student"
  | "young_professional"
  | "family"
  | "pre_retirement"
  | "hnw"
  | "crypto"
  | "business"
  | "kids_teens";
export type Goal =
  | "save"
  | "invest"
  | "borrow"
  | "protect"
  | "spend"
  | "retire"
  | "build_credit"
  | "travel"
  | "home"
  | "education"
  | "family"
  | "business_growth"
  | "kids";
export type ProductTool = "loan-calculator";

export interface SpecRow {
  label: string;
  value: string;
  // Some listing cards show a shorter form of the same fact (e.g. "€50K – €1M").
  listingValue?: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Product {
  // Identity
  sku: string;
  name: string;
  shortName?: string;
  navLabel?: string;
  category: ProductCategory;
  subcategory: string;
  productType: string;
  url: string;
  imageUrl: string;
  accent: string;
  badge?: string;
  segment: Segment;
  tier: Tier;
  inStock: boolean;
  launchedAt: string; // yyyy-mm-ddThh:mm:ss

  // Copy
  description: string; // concise feed description (1–2 sentences)
  cardDescription: string; // listing-card blurb
  tagline: string; // detail-page hero subtitle
  longDescription: string; // detail-page "About" paragraph
  displayPrice: string; // human headline, e.g. "from 3.9% APR"
  perks: string[]; // listing bullet list
  features: string[]; // detail bullet list
  eligibility: string[];
  faq: Faq[];
  keywords: string[];
  feeSummary: string;
  regulatoryNote: string;
  access?: string; // e.g. "Instant withdrawal", "Min. 3 years"
  specs?: SpecRow[]; // spec rows that cannot be derived from the numbers
  cardGradient?: string;
  tools?: ProductTool[];
  contributionPeriod?: "month";
  premiumUnit?: "trip";

  // Audience
  lifeStage: Persona; // primary persona (= personas[0])
  personas: Persona[];
  goals: Goal[];
  relatedSkus: string[];
  rateType: RateType;
  liquidity: Liquidity;

  // Comparable numbers
  price: number; // annual cost to hold/use the product (EUR/year), 0 = free
  annualFee: number; // always equals price (kept for compatibility)
  monthlyFee: number; // EUR/month when billed monthly
  interestRate: number; // APR the customer pays to borrow (%)
  aer: number; // rate the customer earns (%)
  expectedReturnMin: number; // target annual return range for investments (%)
  expectedReturnMax: number;
  annualFeePct: number; // ongoing charge as % of assets per year
  transactionFeePct: number; // cost per transaction (%)
  fxFeePct: number; // foreign-exchange markup (%)
  cashbackPercent: number; // maximum cashback rate (%)
  cashbackMonthlyCap: number; // EUR, 0 = no cap
  minAmount: number; // EUR, 0 = no minimum
  maxAmount: number; // EUR, 0 = no cap
  minTermMonths: number; // 0 = open-ended
  termMonths: number; // maximum term, 0 = open-ended
  noticeDays: number; // 0 = instant access
  riskLevel: number; // 1–10, set for every product
  minAge: number; // years, 0 = any age
  minIncome: number; // EUR/year, 0 = no requirement
  customerRating: number; // 0–5
  reviewCount: number;
  popularityScore: number; // 1–100
}

// What the category modules write. Derived fields are filled in by
// defineProducts(); numeric fields default to 0 so each product only lists
// the numbers that apply to it.
type NumericKey =
  | "monthlyFee"
  | "interestRate"
  | "aer"
  | "expectedReturnMin"
  | "expectedReturnMax"
  | "annualFeePct"
  | "transactionFeePct"
  | "fxFeePct"
  | "cashbackPercent"
  | "cashbackMonthlyCap"
  | "minAmount"
  | "maxAmount"
  | "minTermMonths"
  | "termMonths"
  | "noticeDays"
  | "minAge"
  | "minIncome";

export type ProductInput = Omit<
  Product,
  "lifeStage" | "annualFee" | "inStock" | "imageUrl" | "tier" | "rateType" | "liquidity" | NumericKey
> &
  Partial<Pick<Product, "imageUrl" | "inStock" | "tier" | "rateType" | "liquidity" | NumericKey>>;

export const PERSONA_VALUES: Persona[] = [
  "all",
  "student",
  "young_professional",
  "family",
  "pre_retirement",
  "hnw",
  "crypto",
  "business",
  "kids_teens",
];

export const GOAL_VALUES: Goal[] = [
  "save",
  "invest",
  "borrow",
  "protect",
  "spend",
  "retire",
  "build_credit",
  "travel",
  "home",
  "education",
  "family",
  "business_growth",
  "kids",
];

export const SEGMENT_VALUES: Segment[] = ["personal", "business", "kids", "private"];
export const TIER_VALUES: Tier[] = ["free", "essential", "travel", "premium", "standard", "private", "na"];
export const RATE_TYPE_VALUES: RateType[] = ["fixed", "variable", "none"];
export const LIQUIDITY_VALUES: Liquidity[] = ["instant", "notice", "term", "retirement", "na"];

export function slugOf(product: { url: string }): string {
  return product.url.split("/").filter(Boolean).pop() ?? "";
}

export function groupIdOf(product: { sku: string }): string {
  return `GRP-${product.sku.replace(/-\d{3}$/, "")}`;
}

// Fills derived fields and numeric defaults. personas[0] is the primary
// persona, so lifeStage can never disagree with it.
export function defineProducts(inputs: ProductInput[]): Product[] {
  return inputs.map((p) => {
    if (p.personas.length === 0) throw new Error(`${p.sku}: personas must not be empty`);
    return {
      tier: "na",
      rateType: "none",
      liquidity: "na",
      monthlyFee: 0,
      interestRate: 0,
      aer: 0,
      expectedReturnMin: 0,
      expectedReturnMax: 0,
      annualFeePct: 0,
      transactionFeePct: 0,
      fxFeePct: 0,
      cashbackPercent: 0,
      cashbackMonthlyCap: 0,
      minAmount: 0,
      maxAmount: 0,
      minTermMonths: 0,
      termMonths: 0,
      noticeDays: 0,
      minAge: 0,
      minIncome: 0,
      inStock: true,
      // A real photo per product lives in public/images/products/ (see CREDITS.md
      // there); `npm run images` renders a branded tile only where one is missing.
      imageUrl: `/images/products/${slugOf(p)}.jpg`,
      ...p,
      lifeStage: p.personas[0],
      annualFee: p.price,
    };
  });
}
