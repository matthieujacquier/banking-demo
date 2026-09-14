import { NextResponse } from "next/server";
import { DY_API_BASE, DY_API_KEY } from "./dy-config";

export interface DYCallResult {
  ok: boolean;
  status: number;
  data: unknown;
  debug: { cfPop: string | null; dyTraceId: string | null; vercelRegion: string | null };
}

// Calls the DY Experience API server-side with the secret API key and always
// resolves to parsed JSON (plus routing diagnostics), success or failure.
export async function callDY(path: string, body: unknown, init?: { signal?: AbortSignal }): Promise<DYCallResult> {
  const res = await fetch(`${DY_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DY-API-Key": DY_API_KEY,
    },
    body: JSON.stringify(body),
    signal: init?.signal,
  });

  const text = await res.text();
  let parsed: unknown;
  if (!text) {
    parsed = {
      status: res.status,
      message: res.ok ? "Reported successfully (no content)." : "Request failed.",
    };
  } else {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { status: res.status, raw: text };
    }
  }

  // Surface upstream-routing diagnostics so the Inspector can show which
  // CloudFront edge DY's response came from and the trace id.
  const debug = {
    cfPop: res.headers.get("x-amz-cf-pop"),
    dyTraceId: res.headers.get("dy-trace-id"),
    vercelRegion: process.env.VERCEL_REGION ?? null,
  };
  return { ok: res.ok, status: res.status, data: parsed, debug };
}

// Server-side proxy to the DY Experience API. Injects the secret API key and
// always resolves to JSON so the client-side Inspector can render every call,
// success or failure.
export async function proxyToDY(path: string, body: unknown) {
  try {
    const { status, data: parsed, debug } = await callDY(path, body);
    const data =
      parsed && typeof parsed === "object" ? { ...(parsed as object), _debug: debug } : parsed;

    // A 204 means the event was accepted — surface it as a success to the client.
    return NextResponse.json(data, { status: status === 204 ? 200 : status });
  } catch (err) {
    return NextResponse.json(
      { error: "DY request failed", detail: String(err) },
      { status: 502 },
    );
  }
}
