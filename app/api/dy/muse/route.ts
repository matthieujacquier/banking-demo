import { NextRequest, NextResponse } from "next/server";
import { callDY } from "@/lib/dy-proxy";
import { DY_ENDPOINTS, DY_SELECTORS } from "@/lib/dy-config";
import { buildContext, identityFromBody, pageAttributesFromBody, pageFromBody } from "@/lib/dy-request";

// Pin to US East — DY's US datacenter geo-blocks EU-edge requests with 451.
export const preferredRegion = "iad1";

// DY caps the Shopping Muse prompt at 250 characters.
const MAX_TEXT = 250;

interface MuseSlot {
  sku: string;
  slotId?: string;
  productData?: Record<string, unknown>;
}

interface MuseData {
  assistant?: string;
  widgets?: { title?: string; slots?: MuseSlot[] }[] | null;
  support?: boolean;
  chatId?: string;
}

// DY returns choices[] with type SHOPPING_MUSE_DECISION → variations[0].payload.data.
function extractMuseDecision(res: unknown): { decisionId?: string; data: MuseData } | null {
  const choices = (res as { choices?: unknown[] } | null)?.choices;
  if (!Array.isArray(choices)) return null;
  for (const c of choices as Record<string, unknown>[]) {
    if (c.type !== "SHOPPING_MUSE_DECISION") continue;
    const variations = c.variations as { payload?: { type?: string; data?: MuseData } }[] | undefined;
    const payload = variations?.[0]?.payload;
    if (payload?.type === "SHOPPING_MUSE" && payload.data && typeof payload.data.assistant === "string") {
      return { decisionId: c.decisionId as string | undefined, data: payload.data };
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const text = String(body.text ?? "").trim().slice(0, MAX_TEXT);
  if (!text) return NextResponse.json({ state: "unavailable", error: "Empty prompt" }, { status: 400 });
  const chatId = typeof body.chatId === "string" && body.chatId ? body.chatId : undefined;

  const { user, session } = identityFromBody(body);
  const channel = body.channel === "APP" ? "APP" : "WEB";
  const dyRequest = {
    user,
    session,
    // Omit chatId entirely on the first turn — DY rejects an empty one.
    query: { text, ...(chatId ? { chatId } : {}) },
    context: buildContext(req, {
      page: pageFromBody(body, { type: "OTHER", data: ["MUSE"] }),
      channel,
      pageAttributes: pageAttributesFromBody(body),
    }),
    selector: { name: DY_SELECTORS.muse },
    options: { returnAnalyticsMetadata: true },
  };

  // No fallback by design: until the Shopping Muse campaign is live the UI
  // shows a "warming up" state and the Inspector shows DY's actual answer.
  try {
    const result = await callDY(DY_ENDPOINTS.muse, dyRequest, { signal: AbortSignal.timeout(20000) });
    const decision = extractMuseDecision(result.data);
    if (decision) {
      const res = result.data as Record<string, unknown>;
      return NextResponse.json({
        state: "ok",
        _source: "dy",
        assistant: decision.data.assistant,
        support: decision.data.support ?? false,
        chatId: decision.data.chatId,
        decisionId: decision.decisionId,
        widgets: (decision.data.widgets ?? []).map((w) => ({
          title: w.title,
          items: (w.slots ?? []).map((s) => ({ sku: s.sku, slotId: s.slotId, productData: s.productData })),
        })),
        cookies: res.cookies,
        _debug: result.debug,
      });
    }
    return NextResponse.json({
      state: "unavailable",
      _source: "dy",
      _dy: { status: result.status, response: result.data },
      _request: dyRequest,
      _debug: result.debug,
    });
  } catch (err) {
    return NextResponse.json({
      state: "unavailable",
      _source: "dy",
      _dy: { status: 0, response: String(err) },
      _request: dyRequest,
    });
  }
}
