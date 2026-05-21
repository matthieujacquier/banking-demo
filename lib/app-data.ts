// Mock banking state for the logged-in app demo. Not persisted — purely
// illustrative content for the Classic Banking screens.

export interface Account {
  id: string;
  name: string;
  type: "current" | "savings";
  iban: string;
  balance: number;
}

export interface BankCard {
  sku: string;
  name: string;
  last4: string;
  expiry: string;
  gradient: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  group: string;
  amount: number;
}

export interface Holding {
  sku: string;
  name: string;
  detail: string;
  value: number;
  changePct: number;
}

export interface Advantage {
  sku: string;
  title: string;
  detail: string;
  earned: number;
}

export const ACCOUNTS: Account[] = [
  {
    id: "acc-current",
    name: "Current Account",
    type: "current",
    iban: "BE71 0961 2345 6769",
    balance: 12480.5,
  },
  {
    id: "acc-savings",
    name: "Instant Access Savings",
    type: "savings",
    iban: "BE68 5390 0754 7034",
    balance: 8200.0,
  },
];

export const CARD: BankCard = {
  sku: "CARD-NOM-001",
  name: "NexaNomad Card",
  last4: "4827",
  expiry: "08/29",
  gradient: "linear-gradient(135deg, #164e63 0%, #0B0D12 100%)",
};

export const MONTH_INCOME = 3700.0;
export const MONTH_EXPENSES = 1240.3;

export const TRANSACTIONS: Transaction[] = [
  { id: "tx-01", merchant: "Spotify", category: "Subscriptions", group: "Today", amount: -10.99 },
  { id: "tx-02", merchant: "Carrefour", category: "Groceries", group: "Today", amount: -54.2 },
  { id: "tx-03", merchant: "Salary — Aquila", category: "Income", group: "Yesterday", amount: 3200.0 },
  { id: "tx-04", merchant: "Shell", category: "Fuel", group: "Yesterday", amount: -71.4 },
  { id: "tx-05", merchant: "Netflix", category: "Subscriptions", group: "19 May", amount: -15.99 },
  { id: "tx-06", merchant: "Apple Store", category: "Shopping", group: "19 May", amount: -129.0 },
  { id: "tx-07", merchant: "Transfer from J. Smith", category: "Transfer", group: "18 May", amount: 500.0 },
  { id: "tx-08", merchant: "Le Pain Quotidien", category: "Dining", group: "18 May", amount: -23.5 },
  { id: "tx-09", merchant: "SNCB Rail", category: "Transport", group: "17 May", amount: -42.0 },
  { id: "tx-10", merchant: "Amazon", category: "Shopping", group: "16 May", amount: -67.3 },
  { id: "tx-11", merchant: "Cashback reward", category: "Rewards", group: "16 May", amount: 12.45 },
  { id: "tx-12", merchant: "Pharmacie Centrale", category: "Health", group: "15 May", amount: -18.6 },
];

export const HOLDINGS: Holding[] = [
  { sku: "INV-ETF-001", name: "Global ETF Portfolio", detail: "4 ETFs · fractional", value: 6240.0, changePct: 2.4 },
  { sku: "INV-ROBO-001", name: "Robo-Advisory Portfolio", detail: "Balanced · auto-rebalanced", value: 3115.0, changePct: 1.1 },
  { sku: "INV-FUND-001", name: "Managed Funds", detail: "NexaBank Growth Fund", value: 2080.0, changePct: -0.6 },
];

export const ADVANTAGES: Advantage[] = [
  { sku: "CASH-REW-001", title: "Cashback Rewards", detail: "Earned across 300+ partner brands this year", earned: 184.2 },
  { sku: "CASH-CARD-001", title: "Card Cashback", detail: "3% on groceries & fuel on your NexaNomad Card", earned: 96.55 },
];

export function totalBalance(): number {
  return ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);
}

export function portfolioValue(): number {
  return HOLDINGS.reduce((sum, h) => sum + h.value, 0);
}

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);
}
