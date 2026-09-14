// Canonical public origin — used for absolute URLs in the DY feed and as the
// fallback `page.location` on server-side DY calls (DY rejects an empty one).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "https://banking-demo-five.vercel.app"
).replace(/\/$/, "");
