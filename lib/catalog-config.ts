// Per-category presentation config for the public website: route slugs, hero
// copy, CTA sets, headings, and the derivation of the 3-4 "spec rows" each
// product card and detail sidebar shows. Everything here used to live inline
// in the 16 app/products/* pages; the strings are preserved verbatim.

import {
  CATEGORIES,
  PRODUCTS,
  productsByCategory,
  slugOf,
  type Goal,
  type Persona,
  type Product,
  type ProductCategory,
} from "./products";
import { eur, eurCompact, eurRange } from "./money";

export type SpecView = "listing" | "detail";

export interface Spec {
  label: string;
  value: string;
}

export interface Cta {
  label: string;
  href: (product: Product) => string;
  variant: "primary" | "secondary";
}

export interface CategoryConfig {
  category: ProductCategory;
  routeSlug: string;
  dyId: string;
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  subtitle: string;
  heroStats: (products: Product[]) => [string, string][];
  gridCols: string;
  perksShown: number;
  listingCtas: Cta[];
  detailCta: { label: string; href: (product: Product) => string };
  aboutHeading: string;
  sidebarHeading: string;
  breadcrumb: string;
  disclaimer: string;
  heroStyle: "photo" | "gradient";
  navColumn: number;
  bespoke?: "cards";
  // "merge": derived rows, with product.specs overriding rows of the same
  // label; "replace": product.specs are the rows.
  specsMode: "merge" | "replace";
  deriveSpecs: (product: Product, view: SpecView) => Spec[];
}

const detailHref = (p: Product) => p.url;
const loginHref = () => "/login";
const contactHref = () => "/contact";
const signupHref = (p: Product) => `/signup?product=${p.sku}`;

const count = (products: Product[]) => String(products.length);
const minOf = (products: Product[], pick: (p: Product) => number) =>
  Math.min(...products.map(pick).filter((n) => n > 0));
const maxOf = (products: Product[], pick: (p: Product) => number) =>
  Math.max(...products.map(pick));

// "Up to 30 years" / "Up to 24 months" / "12 – 72 months"
export function termLabel(p: Product): string {
  if (p.termMonths >= 36 && p.termMonths % 12 === 0) return `Up to ${p.termMonths / 12} years`;
  if (p.termMonths > 0 && p.minTermMonths > 1) return `${p.minTermMonths} – ${p.termMonths} months`;
  if (p.termMonths > 0) return `Up to ${p.termMonths} months`;
  return "Open-ended";
}

function minDeposit(p: Product): string {
  return `${eur(p.minAmount)}${p.contributionPeriod ? " / month" : ""}`;
}

function targetReturn(p: Product, view: SpecView): string {
  if (p.expectedReturnMin > 0 && p.expectedReturnMax > 0) {
    return `${p.expectedReturnMin}–${p.expectedReturnMax}% p.a.${view === "detail" ? " (target)" : ""}`;
  }
  return "Market-linked";
}

function feeLabel(p: Product): string {
  if (p.monthlyFee > 0) return `€${p.monthlyFee} / month`;
  if (p.price > 0) return `€${p.price} / year`;
  return "€0";
}

function rateLabel(p: Product): string {
  if (p.interestRate > 0) return `from ${p.interestRate}% APR`;
  if (p.aer > 0) return `${p.aer}% AER`;
  return "—";
}

function amountLabel(p: Product): string {
  if (p.minAmount > 0 && p.maxAmount > 0) return eurRange(p.minAmount, p.maxAmount);
  if (p.maxAmount > 0) return `Up to ${eur(p.maxAmount)}`;
  return "—";
}

const CONFIGS: CategoryConfig[] = [
  {
    category: "Accounts",
    routeSlug: "accounts",
    dyId: "dy-accounts-grid",
    eyebrow: "Products · Accounts",
    eyebrowColor: "#0D9488",
    title: "Current Accounts",
    subtitle:
      "Free everyday banking for every stage of life — from a child's first card to a joint account for the household.",
    heroStats: (ps) => [
      [count(ps), "Account types"],
      ["€0", "Monthly fee"],
      ["0%", "FX fees on card payments"],
      ["10 min", "To open"],
    ],
    gridCols: "md:grid-cols-2 lg:grid-cols-3",
    perksShown: 3,
    listingCtas: [
      { label: "Learn More", href: detailHref, variant: "secondary" },
      { label: "Open Account", href: signupHref, variant: "primary" },
    ],
    detailCta: { label: "Open Account", href: signupHref },
    aboutHeading: "About this account",
    sidebarHeading: "Account summary",
    breadcrumb: "Accounts",
    disclaimer: "Deposits protected up to €100,000 per depositor by the EU Deposit Guarantee Scheme.",
    heroStyle: "gradient",
    navColumn: 0,
    specsMode: "merge",
    deriveSpecs: (p) => [
      { label: "Monthly fee", value: p.monthlyFee > 0 ? `€${p.monthlyFee} / month` : "€0" },
      { label: "Interest", value: p.aer > 0 ? `${p.aer}% AER` : "—" },
      { label: "FX fees", value: p.fxFeePct > 0 ? `${p.fxFeePct}%` : "0%" },
    ],
  },
  {
    category: "Cards",
    routeSlug: "credit-cards",
    dyId: "dy-credit-cards-grid",
    eyebrow: "Products · Cards",
    eyebrowColor: "#2563FF",
    title: "Credit Cards",
    subtitle: "Four cards, one for every stage of life. Earn cashback, travel fee-free, and pay with confidence.",
    heroStats: (ps) => [
      [count(ps), "Cards to choose from"],
      [`Up to ${maxOf(ps, (p) => p.cashbackPercent)}%`, "Cashback rate"],
      [`€${Math.min(...ps.map((p) => p.price))}`, "Entry annual fee"],
      [`${minOf(ps, (p) => p.interestRate)}%`, "Lowest APR"],
    ],
    gridCols: "md:grid-cols-2 lg:grid-cols-4",
    perksShown: 5,
    listingCtas: [{ label: "Apply Now", href: signupHref, variant: "primary" }],
    detailCta: { label: "Apply Now", href: signupHref },
    aboutHeading: "About this card",
    sidebarHeading: "Card summary",
    breadcrumb: "Credit Cards",
    disclaimer: "Credit subject to status. Representative APR varies by card and credit profile.",
    heroStyle: "gradient",
    navColumn: 0,
    bespoke: "cards",
    specsMode: "merge",
    deriveSpecs: (p, view) =>
      view === "listing"
        ? [
            { label: "Fee", value: `€${p.price}` },
            { label: "APR", value: p.interestRate > 0 ? `${p.interestRate}%` : "—" },
            { label: "Cashback", value: `${p.cashbackPercent}%` },
          ]
        : [
            { label: "Annual fee", value: `€${p.price} / year` },
            { label: "Cashback", value: `${p.cashbackPercent}%` },
            { label: "Credit limit", value: `Up to ${eur(p.maxAmount)}` },
          ],
  },
  {
    category: "Loans",
    routeSlug: "loans",
    dyId: "dy-loans-grid",
    eyebrow: "Products · Loans",
    eyebrowColor: "#2563FF",
    title: "Personal Loans",
    subtitle: "Transparent rates, no hidden fees, and a lending experience built for modern life.",
    heroStats: (ps) => [
      [`from ${minOf(ps, (p) => p.interestRate)}%`, "APR interest rate"],
      [eur(maxOf(ps, (p) => p.maxAmount)), "Maximum loan amount"],
      [count(ps), "Loan types"],
      ["24h", "Decision time"],
    ],
    gridCols: "md:grid-cols-2 lg:grid-cols-3",
    perksShown: 0,
    listingCtas: [
      { label: "Learn More", href: detailHref, variant: "secondary" },
      { label: "Apply Now", href: loginHref, variant: "primary" },
    ],
    detailCta: { label: "Apply Now", href: loginHref },
    aboutHeading: "About this loan",
    sidebarHeading: "Loan summary",
    breadcrumb: "Loans",
    disclaimer: "Representative APR shown. Your rate may vary based on your credit profile and loan amount.",
    heroStyle: "photo",
    navColumn: 1,
    specsMode: "merge",
    deriveSpecs: (p) => [
      { label: "Rate", value: p.displayPrice },
      { label: "Amount", value: eurRange(p.minAmount, p.maxAmount) },
      { label: "Term", value: termLabel(p) },
    ],
  },
  {
    category: "Savings",
    routeSlug: "savings",
    dyId: "dy-savings-grid",
    eyebrow: "Products · Savings",
    eyebrowColor: "#2563FF",
    title: "Savings Accounts",
    subtitle: "Make your money work harder. From instant access to pension planning — one bank, every savings goal.",
    heroStats: (ps) => [
      [`up to ${maxOf(ps, (p) => p.aer)}%`, "AER interest rate"],
      [eur(Math.min(...ps.map((p) => p.minAmount))), "Minimum deposit"],
      [count(ps), "Account types"],
      ["Instant", "Access available"],
    ],
    gridCols: "md:grid-cols-2 lg:grid-cols-3",
    perksShown: 3,
    listingCtas: [{ label: "Open Account", href: loginHref, variant: "primary" }],
    detailCta: { label: "Open Account", href: loginHref },
    aboutHeading: "About this account",
    sidebarHeading: "Account summary",
    breadcrumb: "Savings",
    disclaimer: "AER (Annual Equivalent Rate) shown. Rates may vary; check Terms before opening.",
    heroStyle: "gradient",
    navColumn: 1,
    specsMode: "merge",
    deriveSpecs: (p, view) => {
      const rows: Spec[] = [
        {
          label: "Rate",
          value: view === "detail" && p.rateType === "variable" ? `${p.displayPrice} (variable)` : p.displayPrice,
        },
        { label: "Min. deposit", value: minDeposit(p) },
      ];
      if (view === "listing") {
        rows.push({ label: "Max. deposit", value: p.maxAmount > 0 ? `Up to ${eur(p.maxAmount)}` : "No maximum" });
      }
      rows.push({ label: "Access", value: p.access ?? "Instant withdrawal" });
      return rows;
    },
  },
  {
    category: "Investments",
    routeSlug: "investments",
    dyId: "dy-investments-grid",
    eyebrow: "Products · Investments",
    eyebrowColor: "#7C3AED",
    title: "Investments",
    subtitle:
      "Grow your wealth on your terms — from beginner-friendly robo portfolios to actively managed funds. Start with any amount.",
    heroStats: (ps) => [
      [`from ${eur(minOf(ps, (p) => p.minAmount))}`, "Minimum investment"],
      ["500+", "ETFs available"],
      [`${minOf(ps, (p) => p.annualFeePct)}%`, "Lowest annual fee"],
      [count(ps), "Investment products"],
    ],
    gridCols: "md:grid-cols-2",
    perksShown: 3,
    listingCtas: [{ label: "Learn More", href: detailHref, variant: "primary" }],
    detailCta: { label: "Start Investing", href: loginHref },
    aboutHeading: "About this product",
    sidebarHeading: "Product summary",
    breadcrumb: "Investments",
    disclaimer: "Capital at risk. Past performance is not a guide to future returns.",
    heroStyle: "gradient",
    navColumn: 2,
    specsMode: "merge",
    deriveSpecs: (p, view) => [
      { label: "Target return", value: targetReturn(p, view) },
      { label: "Min. investment", value: minDeposit(p) },
      { label: "Holding period", value: p.access ?? "No minimum" },
    ],
  },
  {
    category: "Insurance",
    routeSlug: "insurance",
    dyId: "dy-insurance-grid",
    eyebrow: "Products · Insurance",
    eyebrowColor: "#EA580C",
    title: "Insurance",
    subtitle:
      "Comprehensive cover for your life, home, travels and income. Simple policies, no jargon — manage everything in the app.",
    heroStats: (ps) => [
      [count(ps), "Policy types"],
      ["from €4", "Cheapest policy"],
      ["€10M", "Max medical cover"],
      ["24/7", "Claims support"],
    ],
    gridCols: "md:grid-cols-2",
    perksShown: 3,
    listingCtas: [{ label: "Get a Quote", href: detailHref, variant: "primary" }],
    detailCta: { label: "Get a Quote", href: loginHref },
    aboutHeading: "About this policy",
    sidebarHeading: "Policy summary",
    breadcrumb: "Insurance",
    disclaimer: "Premiums shown are indicative. Final premium depends on personal details and underwriting.",
    heroStyle: "gradient",
    navColumn: 2,
    specsMode: "replace",
    deriveSpecs: (p) => [
      { label: "Cover", value: p.maxAmount > 0 ? `Up to ${eur(p.maxAmount)}` : "—" },
      { label: "Premium", value: `from €${p.monthlyFee || p.price} / ${p.premiumUnit ?? "month"}` },
      { label: "Term", value: termLabel(p) },
    ],
  },
  {
    category: "Crypto",
    routeSlug: "crypto",
    dyId: "dy-crypto-grid",
    eyebrow: "Products · Crypto",
    eyebrowColor: "#F59E0B",
    title: "Crypto",
    subtitle:
      "Buy, hold and stake digital assets directly from your NexaBank account, with bank-grade security and fully insured custody.",
    heroStats: (ps) => [
      [`from ${eur(minOf(ps, (p) => p.minAmount))}`, "Minimum trade"],
      ["0.7%", "BTC spread"],
      ["100%", "Insured custody"],
      [count(ps), "Crypto products"],
    ],
    gridCols: "md:grid-cols-2",
    perksShown: 3,
    listingCtas: [{ label: "Learn More", href: detailHref, variant: "primary" }],
    detailCta: { label: "Start Trading", href: loginHref },
    aboutHeading: "About this product",
    sidebarHeading: "Product summary",
    breadcrumb: "Crypto",
    disclaimer: "Crypto assets are highly volatile and unregulated in some jurisdictions. You may lose all your capital.",
    heroStyle: "gradient",
    navColumn: 2,
    specsMode: "merge",
    deriveSpecs: (p, view) => [
      { label: "Spread", value: p.transactionFeePct > 0 ? `${p.transactionFeePct.toFixed(1)}%` : "—" },
      { label: "Min. trade", value: eur(p.minAmount) },
      { label: "Holdings cap", value: `Up to ${view === "listing" ? eurCompact(p.maxAmount) : eur(p.maxAmount)}` },
    ],
  },
  {
    category: "Cashback",
    routeSlug: "cashback",
    dyId: "dy-cashback-grid",
    eyebrow: "Products · Cashback",
    eyebrowColor: "#EC4899",
    title: "Cashback",
    subtitle:
      "Turn everyday spending into rewards. Automatic cashback on every card, plus exclusive partner offers stacked on top.",
    heroStats: () => [
      ["up to 10%", "Partner cashback"],
      ["300+", "Partner brands"],
      ["€0", "Programme cost"],
      ["48h", "Reward credit time"],
    ],
    gridCols: "md:grid-cols-2",
    perksShown: 3,
    listingCtas: [{ label: "Learn More", href: detailHref, variant: "primary" }],
    detailCta: { label: "Activate Rewards", href: loginHref },
    aboutHeading: "About this product",
    sidebarHeading: "Product summary",
    breadcrumb: "Cashback",
    disclaimer: "Cashback rates and partner offers may change. Check the app for current rates before purchase.",
    heroStyle: "gradient",
    navColumn: 3,
    specsMode: "merge",
    deriveSpecs: (p) => [
      { label: "Cashback rate", value: `up to ${p.cashbackPercent}%` },
      { label: "Monthly cap", value: p.cashbackMonthlyCap > 0 ? eur(p.cashbackMonthlyCap) : "No cap" },
      { label: "Fee", value: p.price > 0 ? `€${p.price} / year` : "€0" },
    ],
  },
  {
    category: "Business",
    routeSlug: "business",
    dyId: "dy-business-grid",
    eyebrow: "Business · Banking",
    eyebrowColor: "#4F46E5",
    title: "Business Banking",
    subtitle: "Accounts, lending, payments and FX built for sole traders, start-ups and growing companies.",
    heroStats: (ps) => [
      [count(ps), "Business products"],
      [`from ${minOf(ps, (p) => p.interestRate)}%`, "APR on growth loans"],
      ["1.2%", "Card acceptance fee"],
      ["48h", "Lending decision"],
    ],
    gridCols: "md:grid-cols-2 lg:grid-cols-3",
    perksShown: 3,
    listingCtas: [{ label: "Learn More", href: detailHref, variant: "primary" }],
    detailCta: { label: "Get Started", href: contactHref },
    aboutHeading: "About this product",
    sidebarHeading: "Product summary",
    breadcrumb: "Business",
    disclaimer: "Business products subject to eligibility checks, trading history and our acceptable-use policy.",
    heroStyle: "gradient",
    navColumn: 3,
    specsMode: "replace",
    deriveSpecs: (p) => [
      { label: "Fee", value: feeLabel(p) },
      { label: "Rate", value: rateLabel(p) },
      { label: "Amount", value: amountLabel(p) },
    ],
  },
  {
    category: "Private Banking",
    routeSlug: "private-banking",
    dyId: "dy-private-banking-grid",
    eyebrow: "Products · Private Banking",
    eyebrowColor: "#B45309",
    title: "Private Banking",
    subtitle:
      "Exclusive banking for exceptional lives — a dedicated relationship manager, bespoke credit facilities, and long-horizon wealth planning.",
    heroStats: (ps) => [
      ["€500K+", "Entry threshold"],
      ["€10M", "Max credit line"],
      [count(ps), "Service pillars"],
      ["24/7", "Manager access"],
    ],
    gridCols: "md:grid-cols-3",
    perksShown: 3,
    listingCtas: [{ label: "Learn More", href: detailHref, variant: "primary" }],
    detailCta: { label: "Request a Meeting", href: contactHref },
    aboutHeading: "About this service",
    sidebarHeading: "Service summary",
    breadcrumb: "Private Banking",
    disclaimer: "Eligibility subject to discovery meeting and source-of-wealth verification.",
    heroStyle: "gradient",
    navColumn: 3,
    specsMode: "merge",
    deriveSpecs: (p) => [
      { label: "AUM threshold", value: `${eur(p.minAmount)}+` },
      { label: "Fee structure", value: p.feeSummary },
      { label: "Commitment", value: "—" },
    ],
  },
  {
    category: "Services",
    routeSlug: "services",
    dyId: "dy-services-grid",
    eyebrow: "Products · Services",
    eyebrowColor: "#64748B",
    title: "Advice & Services",
    subtitle:
      "Free coaching, planning and currency services for NexaBank customers — the human side of digital banking.",
    heroStats: (ps) => [
      [count(ps), "Services"],
      ["Free", "For customers"],
      ["30+", "Currencies"],
      ["24h", "Cash collection"],
    ],
    gridCols: "md:grid-cols-2",
    perksShown: 3,
    listingCtas: [{ label: "Learn More", href: detailHref, variant: "primary" }],
    detailCta: { label: "Book Now", href: contactHref },
    aboutHeading: "About this service",
    sidebarHeading: "Service summary",
    breadcrumb: "Services",
    disclaimer: "Sessions provide general guidance and are not regulated advice unless confirmed in writing.",
    heroStyle: "gradient",
    navColumn: 3,
    specsMode: "replace",
    deriveSpecs: (p) => [
      { label: "Price", value: p.displayPrice },
      { label: "Availability", value: p.access ?? "In the app" },
      { label: "Fee", value: p.feeSummary },
    ],
  },
];

export const CATEGORY_CONFIG: Record<ProductCategory, CategoryConfig> = Object.fromEntries(
  CONFIGS.map((c) => [c.category, c]),
) as Record<ProductCategory, CategoryConfig>;

// Ordered as CATEGORIES.
export const CATEGORY_CONFIGS: CategoryConfig[] = CATEGORIES.map((c) => CATEGORY_CONFIG[c]);

// Site and feed can't drift: every product URL must live under its category route.
for (const p of PRODUCTS) {
  const cfg = CATEGORY_CONFIG[p.category];
  if (!p.url.startsWith(`/products/${cfg.routeSlug}/`)) {
    throw new Error(`${p.sku}: url ${p.url} does not start with /products/${cfg.routeSlug}/`);
  }
}

export function categoryBySlug(routeSlug: string): CategoryConfig | undefined {
  return CONFIGS.find((c) => c.routeSlug === routeSlug);
}

export function productBySlug(category: ProductCategory, slug: string): Product | undefined {
  return productsByCategory(category).find((p) => slugOf(p) === slug);
}

// The rows a listing card / detail sidebar shows for a product.
export function specRows(product: Product, view: SpecView): Spec[] {
  const cfg = CATEGORY_CONFIG[product.category];
  const derived = cfg.deriveSpecs(product, view);
  const overrides = product.specs ?? [];
  const pick = (s: { value: string; listingValue?: string }) =>
    view === "listing" && s.listingValue ? s.listingValue : s.value;

  if (cfg.specsMode === "replace" && overrides.length > 0) {
    return overrides.map((s) => ({ label: s.label, value: pick(s) }));
  }
  // Overrides only replace a derived row of the same label; a row that this
  // view doesn't show (e.g. "Max. deposit" on the detail page) stays hidden.
  return derived.map((row) => {
    const o = overrides.find((s) => s.label === row.label);
    return o ? { label: row.label, value: pick(o) } : row;
  });
}

// The most popular products for a persona (products tagged "all" count for everyone).
export function productsForPersona(persona: Persona, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.personas.includes(persona) || (persona !== "all" && p.personas.includes("all")))
    .sort((a, b) => Number(b.personas[0] === persona) - Number(a.personas[0] === persona) || b.popularityScore - a.popularityScore)
    .slice(0, limit);
}

export const PERSONA_LABEL: Record<Persona, string> = {
  all: "Everyone",
  student: "Students",
  young_professional: "Young professionals",
  family: "Families",
  pre_retirement: "Planning for retirement",
  hnw: "High net worth",
  crypto: "Crypto-curious",
  business: "Business owners",
  kids_teens: "Kids & teens",
};

export const GOAL_LABEL: Record<Goal, string> = {
  save: "Save",
  invest: "Invest",
  borrow: "Borrow",
  protect: "Protect",
  spend: "Spend",
  retire: "Retire",
  build_credit: "Build credit",
  travel: "Travel",
  home: "Home",
  education: "Education",
  family: "Family",
  business_growth: "Grow a business",
  kids: "Kids",
};
