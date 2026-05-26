export const DY_SITE_ID = process.env.NEXT_PUBLIC_DY_SITE_ID ?? "";
export const DY_API_KEY = process.env.DY_SERVER_API_KEY ?? process.env.DY_API_KEY ?? "";
export const DY_API_BASE = "https://dy-api.com/v2";

// Experience API endpoint paths (appended to DY_API_BASE).
export const DY_ENDPOINTS = {
  choose: "/serve/user/choose",
  event: "/collect/user/event",
  pageview: "/collect/user/pageview",
} as const;

// API selector names — these must match the selector configured in the
// Experience OS console for each campaign.
export const DY_SELECTORS = {
  investAdvisorPrompt: "App Invest Advisor Prompt",
};
