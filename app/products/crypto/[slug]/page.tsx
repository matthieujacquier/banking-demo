import { notFound } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";

const PRODUCTS = {
  bitcoin: {
    sku: "CRYPTO-BTC-001",
    category: "Bitcoin",
    accent: "#F59E0B",
    name: "Bitcoin",
    tagline: "Buy, sell and hold BTC directly from your NexaBank account.",
    spread: "0.7%",
    minTrade: "€10",
    holdings: "Up to €250,000",
    description:
      "Bitcoin (BTC) is the original digital asset and the largest by market capitalisation. NexaBank gives you regulated, insured access to BTC with no hidden custody fee — keep your coins in our cold-storage vault, set up an auto-buy schedule, or withdraw to an external wallet whenever you want.",
    features: [
      "Buy from €10 in one tap",
      "Insured cold-storage custody",
      "Auto-buy schedules (daily, weekly, monthly)",
      "Real-time price alerts and watchlist",
      "Withdraw to an external wallet anytime",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Crypto risk acknowledgement signed at onboarding",
      "Tax residency declared at account opening",
    ],
  },
  ethereum: {
    sku: "CRYPTO-ETH-001",
    category: "Ethereum",
    accent: "#D97706",
    name: "Ethereum",
    tagline: "Trade ETH and earn staking rewards inside your NexaBank account.",
    spread: "0.8%",
    minTrade: "€10",
    holdings: "Up to €250,000",
    description:
      "Ethereum (ETH) is the second-largest digital asset and powers a wide range of decentralised applications. NexaBank gives you the same regulated, insured access as Bitcoin, with the added option to opt your ETH balance into staking and earn rewards paid weekly in ETH.",
    features: [
      "Buy from €10 in one tap",
      "Earn staking rewards on ETH balances",
      "Insured cold-storage custody",
      "Auto-buy schedules (daily, weekly, monthly)",
      "Withdraw to an external wallet anytime",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Crypto risk acknowledgement signed at onboarding",
      "Tax residency declared at account opening",
    ],
  },
  "crypto-portfolio": {
    sku: "CRYPTO-PORT-001",
    category: "Portfolio",
    accent: "#B45309",
    name: "Crypto Portfolio",
    tagline: "A pre-built basket of major cryptocurrencies, rebalanced monthly.",
    spread: "1.0%",
    minTrade: "€50",
    holdings: "Up to €250,000",
    description:
      "Crypto Portfolio gives you diversified exposure to the top 10 cryptocurrencies by market cap in a single product. Our partner rebalances the basket every month, so you don't need to manage individual coins. A 1% all-in annual fee covers custody, rebalancing and execution.",
    features: [
      "Pre-built basket of 10 major cryptocurrencies",
      "Monthly rebalancing handled by our partner",
      "All-in 1% annual management fee",
      "Shows as a single line in your portfolio view",
      "No need to research or manage individual coins",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Minimum investment of €50",
      "Crypto risk acknowledgement signed at onboarding",
    ],
  },
  "crypto-staking": {
    sku: "CRYPTO-STAK-001",
    category: "Staking",
    accent: "#92400E",
    name: "Crypto Staking",
    tagline: "Earn passive rewards by locking eligible crypto assets.",
    spread: "—",
    minTrade: "€100",
    holdings: "Up to €100,000",
    description:
      "Crypto Staking lets you put eligible holdings to work. Lock ETH, SOL, ADA and a growing list of other assets to earn rewards paid weekly in the same asset. Unstake any time, subject to the cooldown period for that asset. Projected yields are shown in the app before you commit.",
    features: [
      "Earn rewards on ETH, SOL, ADA and more",
      "Rewards paid weekly in the staked asset",
      "Unstake any time (cooldown periods apply)",
      "Projected yield shown in the app before committing",
      "Validators handled by our regulated partner",
    ],
    eligibility: [
      "Aged 18 or over and EU resident",
      "Active NexaBank current account",
      "Minimum stake of €100 per asset",
      "Crypto risk acknowledgement signed at onboarding",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function CryptoProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS[slug as keyof typeof PRODUCTS];
  if (!product) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "PRODUCT", data: [product.sku] }} />
      <Navbar />

      <section className="relative bg-[#0B0D12] text-white py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 25% 50%, ${product.accent}22 0%, #0B0D12 62%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/products/crypto" className="text-white/70 hover:text-white transition-colors">
              Crypto
            </Link>
            <span className="text-white/70">›</span>
            <span className="text-white">{product.name}</span>
          </div>
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-5"
            style={{ color: product.accent, backgroundColor: `${product.accent}25` }}
          >
            {product.category}
          </span>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>
            {product.name}
          </h1>
          <p className="text-white/85 text-lg max-w-xl">{product.tagline}</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.01em" }}>
                About this product
              </h2>
              <p className="text-[#6B7280] leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-5" style={{ letterSpacing: "-0.01em" }}>
                Key features
              </h2>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 items-start">
                    <span className="font-bold mt-0.5" style={{ color: product.accent }}>✓</span>
                    <span className="text-[#1F2937] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-8" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <h2 className="text-xl font-bold text-[#0B0D12] mb-5" style={{ letterSpacing: "-0.01em" }}>
                Eligibility
              </h2>
              <ul className="space-y-3">
                {product.eligibility.map((e) => (
                  <li key={e} className="flex gap-3 items-start">
                    <span className="text-[#6B7280] mt-0.5">—</span>
                    <span className="text-[#1F2937] text-sm">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl border border-[#D8E0ED] p-7 sticky top-20" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Product summary</p>
              <div className="space-y-3 mb-7">
                {[
                  ["Spread", product.spread],
                  ["Min. trade", product.minTrade],
                  ["Holdings cap", product.holdings],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#D8E0ED] pb-3 text-sm">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#0B0D12] text-right">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/login"
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mb-3"
              >
                Start Trading
              </Link>
              <Link
                href="/contact"
                className="block text-center border border-[#D8E0ED] text-[#0B0D12] py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
              >
                Talk to an Advisor
              </Link>
              <p className="text-[#6B7280] text-xs text-center mt-5 leading-relaxed">
                Crypto assets are highly volatile and unregulated in some jurisdictions. You may lose all your capital.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
