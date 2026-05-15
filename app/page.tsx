import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import Link from "next/link";
import Image from "next/image";

// ─── Hero sections ────────────────────────────────────────────────────────────
// Each section fills the viewport (minus the 64px sticky navbar).
// The background div is a placeholder for future animated 3D canvas.
// Odd-indexed sections position content on the left; even on the right.

const heroSections = [
  {
    id: "dy-hero-banner",
    label: "Credit Cards",
    headline: "The card that rewards your lifestyle",
    subtext: "From everyday cashback to exclusive travel perks — four cards, one for every stage of life.",
    href: "/products/credit-cards",
    accent: "#0891B2",
    // TODO: Replace bg with animated 3D canvas
    bg: "radial-gradient(ellipse at 25% 50%, rgba(8,145,178,0.18) 0%, #0B0D12 62%)",
  },
  {
    id: "dy-loans-section",
    label: "Personal Loans",
    headline: "Finance your next chapter",
    subtext: "Competitive rates for life's big moments — from your first home to funding your education.",
    href: "/products/loans",
    accent: "#2563FF",
    bg: "radial-gradient(ellipse at 75% 50%, rgba(37,99,255,0.16) 0%, #0B0D12 62%)",
  },
  {
    id: "dy-savings-section",
    label: "Savings",
    headline: "Your money, working harder for you",
    subtext: "Instant access to locked-in rates — whatever your savings goal, we have an account for it.",
    href: "/products/savings",
    accent: "#16A34A",
    bg: "radial-gradient(ellipse at 25% 50%, rgba(22,163,74,0.16) 0%, #0B0D12 62%)",
  },
  {
    id: "dy-investments-section",
    label: "Investments",
    headline: "Grow your wealth, on your terms",
    subtext: "From beginner-friendly robo-portfolios to actively managed funds — start with any amount.",
    href: "/products/investments",
    accent: "#7C3AED",
    bg: "radial-gradient(ellipse at 75% 50%, rgba(124,58,237,0.16) 0%, #0B0D12 62%)",
  },
  {
    id: "dy-insurance-section",
    label: "Insurance",
    headline: "Protect what matters most",
    subtext: "Comprehensive cover for your life, home, travels, and income — simple policies, no jargon.",
    href: "/products/insurance",
    accent: "#EA580C",
    bg: "radial-gradient(ellipse at 25% 50%, rgba(234,88,12,0.16) 0%, #0B0D12 62%)",
  },
  {
    id: "dy-crypto-section",
    label: "Crypto",
    headline: "Crypto, made simple",
    subtext: "Buy, hold, and stake digital assets — directly from your NexaBank account, with bank-grade security.",
    href: "/products/crypto",
    accent: "#F59E0B",
    bg: "radial-gradient(ellipse at 75% 50%, rgba(245,158,11,0.16) 0%, #0B0D12 62%)",
  },
  {
    id: "dy-cashback-section",
    label: "Cashback",
    headline: "Earn on every single purchase",
    subtext: "Turn everyday spending into rewards. Automatic cashback on every card, everywhere.",
    href: "/products/cashback",
    accent: "#EC4899",
    bg: "radial-gradient(ellipse at 25% 50%, rgba(236,72,153,0.16) 0%, #0B0D12 62%)",
  },
  {
    id: "dy-private-banking-section",
    label: "Private Banking",
    headline: "Exclusive banking for exceptional lives",
    subtext: "A dedicated relationship manager, bespoke credit lines, and wealth planning — for those who expect more.",
    href: "/products/private-banking",
    accent: "#B45309",
    bg: "radial-gradient(ellipse at 75% 50%, rgba(180,83,9,0.18) 0%, #0B0D12 62%)",
  },
];

// ─── Plans data ───────────────────────────────────────────────────────────────
// Mirrors app/products/credit-cards/page.tsx — account tiers presented as plans.

const plans = [
  {
    sku: "CARD-START-001",
    tier: "Free",
    tierColor: "#16A34A",
    name: "NexaStart",
    tagline: "Start your credit journey with no annual fee and real cashback.",
    fee: "€0",
    cashback: "1%",
    gradient: "linear-gradient(135deg, #14532d 0%, #052e16 100%)",
    popular: false,
    perks: [
      "No annual fee, ever",
      "1% cashback on all purchases",
      "Build your credit history",
      "Apple Pay & Google Pay",
    ],
  },
  {
    sku: "CARD-ESS-001",
    tier: "Essential",
    tierColor: "#2563FF",
    name: "NexaEssential",
    tagline: "Everyday versatility with travel cover and purchase protection.",
    fee: "€49",
    cashback: "0.5%",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #0B0D12 100%)",
    popular: false,
    perks: [
      "0.5% cashback on all purchases",
      "Basic travel insurance included",
      "Purchase protection up to €1,000",
      "Fraud monitoring 24/7",
    ],
  },
  {
    sku: "CARD-NOM-001",
    tier: "Travel",
    tierColor: "#0891B2",
    name: "NexaNomad",
    tagline: "No FX fees, lounge access, and full travel cover — made for travellers.",
    fee: "€99",
    cashback: "1.5%",
    gradient: "linear-gradient(135deg, #164e63 0%, #0B0D12 100%)",
    popular: true,
    perks: [
      "1.5% cashback on all purchases",
      "No foreign transaction fees",
      "2 free airport lounge visits/year",
      "Emergency card replacement worldwide",
    ],
  },
  {
    sku: "CARD-PRES-001",
    tier: "Premium",
    tierColor: "#B45309",
    name: "NexaPrestige",
    tagline: "Our most exclusive card — concierge service, maximum cover, premium perks.",
    fee: "€299",
    cashback: "2%",
    gradient: "linear-gradient(135deg, #451a03 0%, #0B0D12 100%)",
    popular: false,
    perks: [
      "2% cashback on all purchases",
      "24/7 personal concierge service",
      "Unlimited airport lounge access",
      "Dedicated priority support line",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <DYContext context={{ type: "HOMEPAGE" }} />
      <Navbar />

      {/* ─── Hero sections (8 × full-screen) ─────────────────────────────── */}
      {heroSections.map((section, index) => {
        const isRight = index % 2 === 1;

        /* ── Section 0 — Credit Cards: text left, 3D scene floats on the right */
        if (index === 0) {
          return (
            <section
              key={section.id}
              id={section.id}
              className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-[#0B0D12]"
            >
              {/* 3D card scene — full bleed; cards float across the whole section */}
              <iframe
                src="/nexa-cards-bg.html"
                title="NexaBank 3D cards"
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
              />

              {/* Left-to-right dark fade — keeps text legible without cropping the cards */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, rgba(11,13,18,0.92) 0%, rgba(11,13,18,0.78) 22%, rgba(11,13,18,0.35) 45%, rgba(11,13,18,0) 65%)",
                }}
              />

              {/* Dot texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Text content — anchored left, narrow column so it never reaches the cards */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
                <div className="max-w-md lg:max-w-lg">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-5"
                    style={{ color: section.accent }}
                  >
                    {section.label}
                  </p>
                  <h2
                    className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-white mb-6 leading-[1.04]"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {section.headline}
                  </h2>
                  <p className="text-[#6B7280] text-lg mb-10 leading-relaxed max-w-lg">
                    {section.subtext}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={section.href}
                      className="inline-flex items-center gap-2 bg-white text-[#0B0D12] px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors cursor-pointer"
                    >
                      Learn More
                    </Link>
                    <Link
                      href="/contact"
                      className="border border-white/20 text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Talk to an Advisor
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        /* ── Section 2 — Savings: image crossfade bg + new copy + phone-card visual */
        if (index === 2) {
          return (
            <section
              key={section.id}
              id={section.id}
              className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-[#0B0D12]"
            >
              {/* Crossfade carousel — two full-bleed images alternating every ~7s */}
              <div className="absolute inset-0">
                <div className="savings-slide absolute inset-0">
                  <Image
                    src="/savings/family.png"
                    alt="A family unpacking after moving into a new home"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div className="savings-slide savings-slide-2 absolute inset-0">
                  <Image
                    src="/savings/adventure.jpg"
                    alt="A hiker pausing on a mountain trail at dusk"
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Left-to-right dark fade — protects the text column */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, rgba(11,13,18,0.92) 0%, rgba(11,13,18,0.78) 28%, rgba(11,13,18,0.45) 52%, rgba(11,13,18,0.15) 75%, rgba(11,13,18,0.55) 100%)",
                }}
              />

              <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid md:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
                {/* Text column */}
                <div className="max-w-xl">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-5"
                    style={{ color: section.accent }}
                  >
                    {section.label}
                  </p>
                  <h2
                    className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-white mb-6 leading-[1.04]"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    Life, meet savings.
                  </h2>
                  <p className="text-white/90 text-lg md:text-xl mb-5 leading-relaxed max-w-lg">
                    Grow your money with{" "}
                    <span className="font-semibold">4% AER (variable)</span> interest on
                    Instant Access Savings, paid every day.<sup>1</sup>
                  </p>
                  <p className="text-white/55 text-xs mb-10 leading-relaxed max-w-lg">
                    The rate shown above is for our Ultra plan. Different rates apply per
                    plan. The Annual Equivalent Rate (AER) shows the interest you can earn
                    over 1 year. AER is compounded, so you&rsquo;ll earn interest on
                    interest already earned. Interest is liable to applicable taxes. Paid
                    plan fees and T&amp;Cs apply.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={section.href}
                      className="inline-flex items-center gap-2 bg-white text-[#0B0D12] px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors cursor-pointer"
                    >
                      Explore savings
                    </Link>
                    <Link
                      href="/contact"
                      className="border border-white/30 text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Talk to an Advisor
                    </Link>
                  </div>
                </div>

                {/* App savings-goal card — recreated UI, transparent so the carousel shows through */}
                <div
                  className="hidden md:flex flex-col justify-between w-[320px] lg:w-[360px] aspect-[5/6] rounded-3xl border border-white/40 px-7 py-8 backdrop-blur-[2px]"
                  role="img"
                  aria-label="NexaBank app: a New adventure savings goal of £1,326"
                >
                  {/* Top — savings goal */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-white">
                    <p className="text-base font-medium mb-2 drop-shadow-md">New adventure</p>
                    <p
                      className="text-5xl lg:text-[3.5rem] font-bold mb-5 drop-shadow-md"
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      £1,326
                    </p>
                    <button
                      type="button"
                      className="bg-white text-[#0B0D12] text-sm font-semibold px-5 py-2 rounded-full hover:bg-white/90 transition-colors cursor-pointer"
                    >
                      Accounts
                    </button>
                  </div>

                  {/* Bottom — quick-action row */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      aria-label="Add money"
                      className="w-11 h-11 rounded-full bg-white text-[#0B0D12] flex items-center justify-center hover:bg-white/90 transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Transfer"
                      className="w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/55 transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7h13l-3-3M21 17H8l3 3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Move to vault"
                      className="w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/55 transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18M4 21V10l8-5 8 5v11M9 21v-6h6v6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="More"
                      className="w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/55 transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <circle cx="5" cy="12" r="1.6" />
                        <circle cx="12" cy="12" r="1.6" />
                        <circle cx="19" cy="12" r="1.6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        /* ── Section 3 — Investments: full-bleed candlestick scene (left), text overlaid right */
        if (index === 3) {
          return (
            <section
              key={section.id}
              id={section.id}
              className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-[#0B0D12]"
            >
              {/* Candlestick scene — full bleed, left-anchored internally */}
              <iframe
                src="/investments-bg.html"
                title="3D candlestick chart"
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
              />

              {/* Right-to-left dark fade — keeps the text readable on the right side */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to left, rgba(11,13,18,0.94) 0%, rgba(11,13,18,0.78) 24%, rgba(11,13,18,0.35) 48%, rgba(11,13,18,0) 65%)",
                }}
              />

              {/* Dot texture */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Text — anchored right */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
                <div className="max-w-md lg:max-w-lg md:ml-auto">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-5"
                    style={{ color: section.accent }}
                  >
                    {section.label}
                  </p>
                  <h2
                    className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-white mb-6 leading-[1.04]"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {section.headline}
                  </h2>
                  <p className="text-[#6B7280] text-lg mb-10 leading-relaxed max-w-lg">
                    {section.subtext}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={section.href}
                      className="inline-flex items-center gap-2 bg-white text-[#0B0D12] px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors cursor-pointer"
                    >
                      Start investing
                    </Link>
                    <Link
                      href="/contact"
                      className="border border-white/20 text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Talk to an Advisor
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        /* ── Sections 1, 4–7 — standard single-column hero with gradient bg */
        return (
          <section
            key={section.id}
            id={section.id}
            className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden"
          >
            <div className="absolute inset-0" style={{ background: section.bg }} />
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
              <div className={`max-w-2xl ${isRight ? "md:ml-auto" : ""}`}>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-5"
                  style={{ color: section.accent }}
                >
                  {section.label}
                </p>
                <h2
                  className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-white mb-6 leading-[1.04]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {section.headline}
                </h2>
                <p className="text-[#6B7280] text-lg mb-10 leading-relaxed max-w-lg">
                  {section.subtext}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={section.href}
                    className="inline-flex items-center gap-2 bg-white text-[#0B0D12] px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors cursor-pointer"
                  >
                    Learn More
                  </Link>
                  <Link
                    href="/contact"
                    className="border border-white/20 text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Talk to an Advisor
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── Plans section (card grid) ────────────────────────────────────── */}
      <section
        id="plans"
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-24 px-6 bg-[#F6F7FB]"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-3">Plans</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0B0D12] mb-4"
              style={{ letterSpacing: "-0.025em" }}
            >
              Choose your NexaBank plan
            </h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              All the benefits of NexaBank, scaled to your life.
            </p>
          </div>

          <div id="dy-featured-products" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.sku}
                className="bg-white rounded-3xl border border-[#D8E0ED] p-6 flex flex-col relative"
                style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2563FF] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                    Most Popular
                  </div>
                )}

                {/* Card visual */}
                <div
                  className="rounded-2xl h-36 mb-5 relative overflow-hidden flex-shrink-0"
                  style={{ background: plan.gradient }}
                >
                  <div
                    className="absolute top-4 left-4 w-8 h-6 rounded"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.12)" }}
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm tracking-wide">{plan.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>NexaBank</p>
                  </div>
                </div>

                {/* Tier badge */}
                <span
                  className="self-start text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
                  style={{ color: plan.tierColor, backgroundColor: `${plan.tierColor}18` }}
                >
                  {plan.tier}
                </span>

                <h3
                  className="font-bold text-[#0B0D12] text-xl mb-1"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {plan.name}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">{plan.tagline}</p>

                {/* Fee + cashback */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[["Fee / yr", plan.fee], ["Cashback", plan.cashback]].map(([lbl, val]) => (
                    <div key={lbl} className="bg-[#F6F7FB] rounded-xl p-2.5 text-center">
                      <p className="text-[#6B7280] text-xs mb-0.5">{lbl}</p>
                      <p className="font-bold text-[#0B0D12] text-sm">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Perks */}
                <ul className="space-y-2 mb-6 text-sm">
                  {plan.perks.map((p) => (
                    <li key={p} className="flex gap-2 items-start">
                      <span className="font-bold mt-0.5 shrink-0" style={{ color: plan.tierColor }}>✓</span>
                      <span className="text-[#6B7280]">{p}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors cursor-pointer"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
