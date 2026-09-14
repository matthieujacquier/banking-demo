export const DY_SITE_ID = process.env.NEXT_PUBLIC_DY_SITE_ID ?? "";
export const DY_API_KEY = process.env.DY_SERVER_API_KEY ?? process.env.DY_API_KEY ?? "";
export const DY_API_BASE = "https://dy-api.com/v2";

// Experience API endpoint paths (appended to DY_API_BASE).
export const DY_ENDPOINTS = {
  choose: "/serve/user/choose",
  event: "/collect/user/event",
  pageview: "/collect/user/pageview",
  engagement: "/collect/user/engagement",
  search: "/serve/user/search",
  muse: "/serve/user/agent-assistant",
} as const;

// API selector names — these must match the selector configured in the
// Experience OS console for each campaign.
export const DY_SELECTORS = {
  investAdvisorPrompt: "App Invest Advisor Prompt",
  homeRecs: "App Home Recommendations",
  offers: "App Offers",
  // Search and Muse selector names are fixed by DY — not configurable.
  search: "Semantic Search",
  muse: "Shopping Muse",
};

// Set NEXT_PUBLIC_MUSE_MODE=template to hand the launcher over to DY's own
// Shopping Muse Chat template (it listens for clicks on `.dy-chat-cta`).
export const MUSE_MODE = process.env.NEXT_PUBLIC_MUSE_MODE === "template" ? "template" : "api";
