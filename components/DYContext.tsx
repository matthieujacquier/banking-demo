import Script from "next/script";
import { DY_SITE_ID } from "@/lib/dy-config";
import DYContextUpdater from "./DYContextUpdater";

type DYPageContext =
  | { type: "HOMEPAGE" }
  | { type: "CATEGORY"; data: string[] }
  | { type: "PRODUCT"; data: string[] }
  | { type: "CART" }
  | { type: "OTHER"; data: string[] };

export default function DYContext({ context }: { context: DYPageContext }) {
  if (!DY_SITE_ID) return null;

  return (
    <>
      {/* 1. Init window.DY and set page context BEFORE api_dynamic.js loads */}
      <Script
        id="dy-page-context"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.DY = window.DY || {}; DY.recommendationContext = ${JSON.stringify(context)};`,
        }}
      />
      {/* 2. Load DY scripts synchronously after context is set */}
      <Script
        id="dy-api-dynamic"
        strategy="beforeInteractive"
        src={`//cdn.dynamicyield.com/api/${DY_SITE_ID}/api_dynamic.js`}
      />
      <Script
        id="dy-api-static"
        strategy="beforeInteractive"
        src={`//cdn.dynamicyield.com/api/${DY_SITE_ID}/api_static.js`}
      />
      {/* Mirror context into window.DY on every client render so DY's
          "context change" detection (Pageview Detection setting) picks up
          Next.js soft-navigations. The beforeInteractive scripts above only
          run on initial document load. */}
      <DYContextUpdater context={context} />
    </>
  );
}
