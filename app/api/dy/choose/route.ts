import { NextRequest, NextResponse } from "next/server";
import { DY_API_KEY, DY_API_BASE } from "@/lib/dy-config";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${DY_API_BASE}/serve/user/choose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DY-API-Key": DY_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
