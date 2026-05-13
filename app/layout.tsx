import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DY_SITE_ID } from "@/lib/dy-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexaBank",
  description: "Banking built for your future",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Dynamic Yield — US data center — synchronous, immediately after <head> */}
        <link rel="preconnect" href="//cdn.dynamicyield.com" />
        <link rel="preconnect" href="//st.dynamicyield.com" />
        <link rel="preconnect" href="//rcom.dynamicyield.com" />
        {DY_SITE_ID && (
          <>
            <script
              type="text/javascript"
              src={`//cdn.dynamicyield.com/api/${DY_SITE_ID}/api_dynamic.js`}
            />
            <script
              type="text/javascript"
              src={`//cdn.dynamicyield.com/api/${DY_SITE_ID}/api_static.js`}
            />
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
