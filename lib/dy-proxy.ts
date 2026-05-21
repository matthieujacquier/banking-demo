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
    let data: unknown;
    if (!text) {
      data = {
        status: res.status,
        message: res.ok ? "Reported successfully (no content)." : "Request failed.",
      };
    } else {
      try {
        data = JSON.parse(text);
      } catch {
        data = { status: res.status, raw: text };
      }
    }

    // A 204 means the event was accepted — surface it as a success to the client.
    return NextResponse.json(data, { status: res.status === 204 ? 200 : res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "DY request failed", detail: String(err) },
      { status: 502 },
    );
  }
}
