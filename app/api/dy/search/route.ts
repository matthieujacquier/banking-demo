import { NextRequest, NextResponse } from "next/server";
import { callDY } from "@/lib/dy-proxy";
import { DY_ENDPOINTS, DY_SELECTORS } from "@/lib/dy-config";
import { buildContext, identityFromBody, pageAttributesFromBody, pageFromBody } from "@/lib/dy-request";
import { localSearch, type SearchData, type SearchFilter } from "@/lib/search-local";

// Pin to US East — DY's US datacenter geo-blocks EU-edge requests with 451.
export const preferredRegion = "iad1";

const MAX_TEXT = 250;

interface SearchDecision {
  decisionId?: string;
  name?: string;
  data: SearchData;
}

// DY returns choices[] with type SEMANTIC_SEARCH_DECISION → variations[0].payload.data.
function extractSearchDecision(res: unknown): SearchDecision | null {
  const choices = (res as { choices?: unknown[] } | null)?.choices;
  if (!Array.isArray(choices)) return null;
  for (const c of choices as Record<string, unknown>[]) {
    if (c.type !== "SEMANTIC_SEARCH_DECISION") continue;
    const variations = c.variations as { payload?: { type?: string; data?: SearchData } }[] | undefined;
    const payload = variations?.[0]?.payload;
    if (payload?.type === "SEARCH" && payload.data && Array.isArray(payload.data.slots)) {
      return { decisionId: c.decisionId as string | undefined, name: c.name as string | undefined, data: payload.data };
    }
  }
  return null;
}

function sanitizeFilters(raw: unknown): SearchFilter[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((f): f is Record<string, unknown> => !!f && typeof f === "object" && typeof (f as { field?: unknown }).field === "string")
    .slice(0, 15)
    .map((f) => {
      const out: SearchFilter = { field: f.field as string };
      if (Array.isArray(f.values)) out.values = f.values.map(String).slice(0, 100);
      if (typeof f.min === "number") out.min = f.min;
      if (typeof f.max === "number") out.max = f.max;
      return out;
    });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const text = String(body.text ?? "").slice(0, MAX_TEXT);
  const pagination = (body.pagination ?? {}) as { numItems?: number; offset?: number };
  const sortBy = body.sortBy as { field?: string; order?: string } | undefined;

  const query = {
    text,
    filters: sanitizeFilters(body.filters),
    pagination: {
      numItems: Math.max(1, Math.min(100, Number(pagination.numItems) || 24)),
      offset: Math.max(0, Number(pagination.offset) || 0),
    },
    ...(sortBy?.field
      ? { sortBy: { field: String(sortBy.field), order: sortBy.order === "asc" ? ("asc" as const) : ("desc" as const) } }
      : {}),
    enableSpellCheck: true,
  };

  const { user, session } = identityFromBody(body);
  const channel = body.channel === "APP" ? "APP" : "WEB";
  const dyRequest = {
    user,
    session,
    query,
    context: buildContext(req, {
      page: pageFromBody(body, { type: "OTHER", data: ["SEARCH"] }),
      channel,
      pageAttributes: pageAttributesFromBody(body),
    }),
    selector: { name: DY_SELECTORS.search },
    options: { returnAnalyticsMetadata: true, isImplicitKeywordSearchEvent: true },
  };

  // 1. Real DY Semantic Search.
  let dyStatus = 0;
  let dyError: unknown = null;
  try {
    const result = await callDY(DY_ENDPOINTS.search, dyRequest, { signal: AbortSignal.timeout(6000) });
    dyStatus = result.status;
    const decision = extractSearchDecision(result.data);
    if (decision) {
      const res = result.data as Record<string, unknown>;
      return NextResponse.json({
        _source: "dy",
        decisionId: decision.decisionId,
        name: decision.name,
        data: decision.data,
        cookies: res.cookies,
        warnings: res.warnings,
        _debug: result.debug,
      });
    }
    dyError = result.data;
  } catch (err) {
    dyError = String(err);
  }

  // 2. Local fallback — same shape, flagged so the UI and Inspector can tell.
  const data = localSearch(query);

  // DY only reports the keyword-search event implicitly on a successful search,
  // so report it ourselves to keep affinity data flowing. Best effort.
  if (text.trim()) {
    void callDY(
      DY_ENDPOINTS.event,
      {
        user,
        session,
        events: [{ name: "Keyword Search", properties: { dyType: "keyword-search-v1", keywords: text.trim() } }],
      },
      { signal: AbortSignal.timeout(3000) },
    ).catch(() => undefined);
  }

  return NextResponse.json({
    _source: "local",
    data,
    _dy: { status: dyStatus, response: dyError },
    _request: dyRequest,
  });
}
