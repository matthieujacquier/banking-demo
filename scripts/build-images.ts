// Renders a branded 1200×1200 PNG tile for every product that has no real
// photo (public/images/products/<slug>.png), so DY's semantic-search training
// never sees a missing image. Run with `npm run images`. Uses sharp, which
// Next.js already installs.

import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { PRODUCTS, slugOf } from "../lib/products";

// Run from the project root (`npm run images`).
const root = process.cwd();
const outDir = resolve(root, "public", "images", "products");
mkdirSync(outDir, { recursive: true });

const SIZE = 1200;

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Wrap a product name into at most three lines of ~16 characters.
function wrap(name: string): string[] {
  const words = name.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 16 && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function tileSvg(name: string, category: string, accent: string): string {
  const lines = wrap(name);
  const fontSize = lines.some((l) => l.length > 13) ? 84 : 96;
  const lineHeight = fontSize * 1.12;
  const startY = SIZE / 2 + 60 - ((lines.length - 1) * lineHeight) / 2;
  const text = lines
    .map(
      (l, i) =>
        `<text x="96" y="${startY + i * lineHeight}" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#FFFFFF" letter-spacing="-2">${escapeXml(l)}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0B0D12"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.8" cy="0.2" r="0.7">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="#0B0D12"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
  <circle cx="930" cy="300" r="210" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="28"/>
  <circle cx="930" cy="300" r="120" fill="#FFFFFF" fill-opacity="0.12"/>
  <rect x="96" y="96" width="176" height="48" rx="24" fill="#FFFFFF" fill-opacity="0.14"/>
  <text x="120" y="129" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF" letter-spacing="4">${escapeXml(category.toUpperCase())}</text>
  ${text}
  <text x="96" y="1090" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="40" font-weight="800" font-style="italic" fill="#FFFFFF" fill-opacity="0.85" letter-spacing="-1">NEXA</text>
  <text x="212" y="1090" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="28" fill="#FFFFFF" fill-opacity="0.55">Bank</text>
</svg>`;
}

async function main() {
  let written = 0;
  for (const p of PRODUCTS) {
    if (!p.imageUrl.startsWith("/images/products/")) continue;
    const file = resolve(outDir, `${slugOf(p)}.png`);
    const svg = tileSvg(p.shortName ?? p.name, p.category, p.accent);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
    written++;
  }
  console.log(`Wrote ${written} product tiles to public/images/products/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
