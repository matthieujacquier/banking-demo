import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["800"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "NexaBank",
  description: "Banking built for your future",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect hints for DY CDN — US data center */}
        <link rel="preconnect" href="//cdn.dynamicyield.com" />
        <link rel="preconnect" href="//st.dynamicyield.com" />
        <link rel="preconnect" href="//rcom.dynamicyield.com" />
        {/* DY scripts are injected per-page via DYContext to guarantee
            recommendationContext is set before api_dynamic.js loads */}
      </head>
      <body className={`${inter.className} ${outfit.variable}`}>{children}</body>
    </html>
  );
}
