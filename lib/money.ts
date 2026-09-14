// EUR formatting shared by the website, the app and the catalog spec rows.

const whole = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const cents = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const compact = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
});

// "€50,000"
export function eur(amount: number): string {
  return whole.format(amount);
}

// "€1,240.30"
export function formatEUR(amount: number): string {
  return cents.format(amount);
}

// "€250K", "€1M"
export function eurCompact(amount: number): string {
  return compact.format(amount);
}

// "€50,000 – €1,000,000"
export function eurRange(min: number, max: number): string {
  return `${eur(min)} – ${eur(max)}`;
}

// "€50K – €1M"
export function eurRangeCompact(min: number, max: number): string {
  return `${eurCompact(min)} – ${eurCompact(max)}`;
}

// 3.9 → "3.9%", 2 → "2%"
export function pct(value: number): string {
  return `${value}%`;
}
