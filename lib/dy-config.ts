export const DY_SITE_ID = process.env.NEXT_PUBLIC_DY_SITE_ID ?? "";
export const DY_API_KEY = process.env.DY_API_KEY ?? "";
export const DY_API_BASE = "https://dy-api.com/v2";

// Experience API endpoint paths (appended to DY_API_BASE).
export const DY_ENDPOINTS = {
  choose: "/serve/user/choose",
  event: "/collect/user/event",
  engagement: "/collect/user/engagement",
  pageview: "/collect/user/pageview",
} as const;

// API Selector names for the app's recommendation slots. These map to
// campaigns configured in the Experience OS console.
export const DY_SELECTORS = {
  homeRecs: "App Home Recommendations",
  productsRecs: "App Products Recommendations",
};
