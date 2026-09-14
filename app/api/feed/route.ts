import { buildFeedCsv } from "@/lib/feed";

// The DY product feed, generated from lib/products.ts at build time. Download
// it, or paste this URL into DY (Feeds › Product Feed) as the feed source.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildFeedCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nexabank_product_feed.csv"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
