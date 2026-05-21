import { NextRequest } from "next/server";
import { proxyToDY } from "@/lib/dy-proxy";
import { DY_ENDPOINTS } from "@/lib/dy-config";

export async function POST(req: NextRequest) {
  return proxyToDY(DY_ENDPOINTS.engagement, await req.json());
}
