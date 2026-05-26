import { NextRequest } from "next/server";
import { proxyToDY } from "@/lib/dy-proxy";

// Pin to US East — DY's US datacenter geo-blocks EU-edge requests with 451.
export const preferredRegion = "iad1";

export async function POST(req: NextRequest) {
  return proxyToDY("/collect/user/engagement", await req.json());
}
