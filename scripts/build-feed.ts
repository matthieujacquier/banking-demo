// Writes nexabank_product_feed.csv from lib/products.ts after validating it
// against the DY rules in FEED_SCHEMA.md. Run with `npm run feed`.

import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FEED_HEADER, SITE_URL, feedRows, toCsv, validateFeed } from "../lib/feed";

// Run from the project root (`npm run feed`).
const root = process.cwd();
const rows = feedRows();
const errors = validateFeed(rows, FEED_HEADER, {
  fileExists: (rel) => existsSync(resolve(root, "public", `.${rel}`)),
});

if (errors.length > 0) {
  console.error(`Feed validation failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const out = resolve(root, "nexabank_product_feed.csv");
writeFileSync(out, toCsv(rows), "utf-8");
console.log(`Wrote ${out}`);
console.log(`  ${rows.length} products × ${FEED_HEADER.length} columns · base URL ${SITE_URL}`);
