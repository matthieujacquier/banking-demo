import { CATEGORY_CONFIGS } from "./catalog-config";
import { productsByCategory } from "./products";

// Site navigation, derived from the catalog so a new product or category
// shows up in the menus without touching the Navbar.

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  heading: string;
  href: string;
  items: NavItem[];
}

export const TOP_LINKS: NavItem[] = [
  { label: "Business", href: "/business" },
  { label: "Plans", href: "/#plans" },
  { label: "Rates", href: "/rates" },
  { label: "Help", href: "/help" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const NAV_HUBS: NavItem[] = [
  { label: "Family & kids", href: "/family" },
  { label: "Why NexaBank", href: "/why-nexabank" },
  { label: "Compare products", href: "/compare" },
];

export function navGroups(): NavGroup[] {
  return CATEGORY_CONFIGS.map((cfg) => ({
    heading: cfg.title,
    href: `/products/${cfg.routeSlug}`,
    items: productsByCategory(cfg.category).map((p) => ({ label: p.navLabel ?? p.shortName ?? p.name, href: p.url })),
  }));
}

// The mega-menu columns (grouped by each category's navColumn).
export function navColumns(): NavGroup[][] {
  const columns: NavGroup[][] = [[], [], [], []];
  for (const cfg of CATEGORY_CONFIGS) {
    const group = navGroups().find((g) => g.heading === cfg.title);
    if (group) columns[Math.min(3, Math.max(0, cfg.navColumn))].push(group);
  }
  return columns;
}
