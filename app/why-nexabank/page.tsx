import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import AskMuseButton from "@/components/website/AskMuseButton";
import PersonaSwitch, { type PersonaPanel } from "@/components/website/PersonaSwitch";
import { PRODUCTS, type Persona } from "@/lib/products";
import { PERSONA_LABEL, productsForPersona } from "@/lib/catalog-config";

const VALUE_PROPS = [
  {
    title: "0% FX on card payments",
    body: "Pay in 150+ currencies at the real exchange rate with any NexaBank account card. Traditional banks add 2–3% — we add nothing.",
    accent: "#0D9488",
  },
  {
    title: "Deposits protected up to €100,000",
    body: "Every savings and current account is covered by the EU Deposit Guarantee Scheme, per depositor, automatically.",
    accent: "#16A34A",
  },
  {
    title: "One page for every rate and fee",
    body: "No footnotes, no hidden charges. Every product's numbers use the same labels — compare a card with a savings account if you like.",
    accent: "#2563FF",
  },
  {
    title: "Humans, 24/7",
    body: "Chat in the app and reach a person within two minutes, any hour. Free money coaching and mortgage advice for every customer.",
    accent: "#7C3AED",
  },
  {
    title: "Rated 4.7 by 40,000+ customers",
    body: "Across accounts, savings and investing — and we publish every product's rating next to it.",
    accent: "#F59E0B",
  },
  {
    title: "Grows with your life",
    body: "From a child's first card to a joint account, a mortgage, a pension and private banking — one app, no re-onboarding.",
    accent: "#EA580C",
  },
];

const PERSONA_COPY: Record<Persona, { headline: string; points: string[] }> = {
  all: {
    headline: "Everyday banking that stays free",
    points: ["A free current account with instant payments", "Savings from day one at 3.5% AER", "Cashback on every card and 300+ partner brands"],
  },
  student: {
    headline: "Built for student life",
    points: ["€500 interest-free overdraft and no monthly fee", "0% FX for the year abroad", "Our lowest loan rate — from 2.9% APR — for tuition and living costs"],
  },
  young_professional: {
    headline: "Salary in, goals out",
    points: ["Round-Up Pots save the spare change automatically", "Start investing from €50 with a 0.45% robo portfolio", "NexaNomad: 1.5% cashback and no FX fees for travel"],
  },
  family: {
    headline: "Money for the whole household",
    points: ["Joint account with two cards and shared budgets", "NexaKids and NexaTeen with parental controls, junior savings at 4% AER", "Mortgage advice, life and home cover in one place"],
  },
  pre_retirement: {
    headline: "Protect what you've built",
    points: ["Term deposits up to 4.8% AER with no market risk", "Bond fund and pension plans with a de-risking glide path", "A free retirement planning consultation with a qualified adviser"],
  },
  hnw: {
    headline: "Private banking without the marble",
    points: ["A named relationship manager, reachable directly", "Lombard and asset-backed credit up to €10M", "Wealth, succession and cross-border tax planning in-house"],
  },
  crypto: {
    headline: "Regulated, insured crypto in your bank",
    points: ["Bitcoin and Ethereum from €10 with insured cold storage", "Staking rewards up to 8% APY paid weekly", "A diversified top-10 crypto basket, rebalanced monthly"],
  },
  business: {
    headline: "A bank that runs your back office",
    points: ["Business account with invoicing, team cards and accounting sync", "Card acceptance at a flat 1.2%, settled next day", "Growth loans to €500,000 with a decision in 48 hours"],
  },
  kids_teens: {
    headline: "Their first money lessons, your controls",
    points: ["A parent-controlled card and pocket money on a schedule", "Savings goals that earn 4% AER", "An investment plan that becomes theirs at 18"],
  },
};

const PERSONAS: Persona[] = ["family", "young_professional", "student", "pre_retirement", "business", "kids_teens", "hnw", "crypto"];

export default function WhyNexaBankPage() {
  const panels: PersonaPanel[] = PERSONAS.map((id) => ({
    id,
    label: PERSONA_LABEL[id],
    headline: PERSONA_COPY[id].headline,
    points: PERSONA_COPY[id].points,
    products: productsForPersona(id, 3).map((p) => ({
      sku: p.sku,
      name: p.name,
      displayPrice: p.displayPrice,
      url: p.url,
      accent: p.accent,
      category: p.category,
    })),
  }));
  const productCount = PRODUCTS.length;

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["WHY"] }} />
      <Navbar />

      <section id="dy-why-hero" className="bg-[#0B0D12] text-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Why NexaBank</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
            A bank that shows its numbers and knows your name.
          </h1>
          <p className="text-white/70 max-w-2xl text-lg mb-10">
            {productCount} products, one app, one set of rules: no FX fees on your account card, deposits protected to
            €100,000, every rate on one page, and a person to talk to at 3am.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup?product=ACC-EVERY-001"
              className="bg-white text-[#0B0D12] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
            >
              Open a free account
            </Link>
            <Link
              href="/rates"
              className="border border-white/25 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
            >
              See every rate
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#F6F7FB]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-3xl border border-[#D8E0ED] p-7"
              style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)", borderTop: `3px solid ${v.accent}` }}
            >
              <h2 className="font-bold text-[#0B0D12] text-xl mb-2" style={{ letterSpacing: "-0.01em" }}>
                {v.title}
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-3">For you</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B0D12] mb-8" style={{ letterSpacing: "-0.025em" }}>
            What this means for you
          </h2>
          {/* DY can pre-select the visitor's persona here */}
          <div id="dy-why-persona">
            <PersonaSwitch panels={panels} initial="family" />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0D12] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
            Still comparing banks?
          </h2>
          <p className="text-white/70 mb-8">
            Ask Muse how NexaBank compares for your situation, or put our products side by side with the numbers in front
            of you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <AskMuseButton
              prompt="Why should I choose NexaBank over my current bank?"
              className="bg-white text-[#0B0D12] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
            />
            <Link
              href="/compare"
              className="border border-white/25 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
            >
              Compare products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
