import { NextResponse } from "next/server";
import { DY_API_BASE, DY_API_KEY } from "./dy-config";

// Server-side proxy to the DY Experience API. Injects the secret API key and
// always resolves to JSON so the client-side Inspector can render every call,
// success or failure.
export async function proxyToDY(path: string, body: unknown) {
  try {
    const res = await fetch(`${DY_API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DY-API-Key": DY_API_KEY,
      },
      body: JSON.stringify(body),
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
    const data =
      parsed && typeof parsed === "object" ? { ...(parsed as object), _debug: debug } : parsed;

    // A 204 means the event was accepted — surface it as a success to the client.
    return NextResponse.json(data, { status: res.status === 204 ? 200 : res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "DY request failed", detail: String(err) },
      { status: 502 },
    );
  }
}
