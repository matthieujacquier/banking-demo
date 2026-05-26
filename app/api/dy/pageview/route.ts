import { NextRequest } from "next/server";
import { proxyToDY } from "@/lib/dy-proxy";
import { DY_ENDPOINTS } from "@/lib/dy-config";

// Pin to US East so the outbound request hits DY's US CloudFront edge
// rather than CDG (Paris), which geo-blocks our US-region DY account with 451.
export const preferredRegion = "iad1";

export async function POST(req: NextRequest) {
  return proxyToDY(DY_ENDPOINTS.pageview, await req.json());
}
