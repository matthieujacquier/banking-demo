import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import SearchBox from "@/components/website/SearchBox";
import AskMuseButton from "@/components/website/AskMuseButton";
import { CATEGORIES, productsByCategory } from "@/lib/products";
import { CATEGORY_CONFIG } from "@/lib/catalog-config";

// Help centre — every product's questions, grouped by category, plus the
// ways to reach a person. The FAQ content is the same `faq` column DY gets.

const GENERAL = [
  {
    q: "How do I open an account?",
    a: "Download the app or tap Open account, scan your ID and confirm your address. Most customers have an IBAN within ten minutes.",
  },
  {
    q: "Is my money protected?",
    a: "Deposits are protected up to €100,000 per depositor by the EU Deposit Guarantee Scheme. Investments and crypto assets are not guaranteed — their value can fall as well as rise.",
  },
  {
    q: "Are there fees for using my card abroad?",
    a: "No — account cards carry a 0% FX markup on card payments. Credit cards vary: NexaNomad and NexaPrestige have no FX fee; NexaStart and NexaEssential add 2–2.5%.",
  },
  {
    q: "How do I talk to a person?",
    a: "Chat in the app 24/7, call the number on the back of your card, or book a free coaching, mortgage or retirement session from Services.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["HELP"] }} />
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Help centre</p>
          <h1 className="text-5xl font-bold mb-6" style={{ letterSpacing: "-0.025em" }}>
            How can we help?
          </h1>
          <SearchBox variant="hero" />
          <p className="text-[#6B7280] text-sm mt-4">Search products in your own words, or browse the questions below.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[240px_1fr] gap-10">
          <aside className="space-y-2 lg:sticky lg:top-24 self-start">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">Topics</p>
            <a href="#help-general" className="block text-sm font-semibold text-[#0B0D12] hover:text-[#2563FF]">
              Getting started
            </a>
            {CATEGORIES.map((c) => (
              <a
                key={c}
                href={`#help-${CATEGORY_CONFIG[c].routeSlug}`}
                className="block text-sm font-semibold text-[#0B0D12] hover:text-[#2563FF]"
              >
                {CATEGORY_CONFIG[c].title}
              </a>
            ))}
            {/* DY can slot a contextual promo here — e.g. "book a mortgage appointment" for home-affinity visitors */}
            <div id="dy-help-promo" className="mt-6 bg-[#E7EEFF] border border-[#2563FF]/20 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-1">Need a human?</p>
              <p className="text-sm text-[#1F2937] mb-3">Free 45-minute money coaching for every customer.</p>
              <Link href="/products/services/financial-coaching" className="text-sm font-bold text-[#2563FF] hover:underline">
                Book a session →
              </Link>
            </div>
          </aside>

          <div className="space-y-10">
            <div id="help-general" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.02em" }}>
                Getting started
              </h2>
              <div className="bg-white rounded-3xl border border-[#D8E0ED] px-6 divide-y divide-[#D8E0ED]" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
                {GENERAL.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-[#0B0D12]">
                      {f.q}
                      <span className="text-[#6B7280] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="text-[#6B7280] text-sm leading-relaxed mt-2 pr-6">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {CATEGORIES.map((category) => {
              const cfg = CATEGORY_CONFIG[category];
              const products = productsByCategory(category);
              return (
                <div key={category} id={`help-${cfg.routeSlug}`} className="scroll-mt-24">
                  <div className="flex items-baseline justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
                      {cfg.title}
                    </h2>
                    <Link href={`/products/${cfg.routeSlug}`} className="text-xs font-bold text-[#2563FF] hover:underline">
                      Products →
                    </Link>
                  </div>
                  <div className="bg-white rounded-3xl border border-[#D8E0ED] px-6 divide-y divide-[#D8E0ED]" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
                    {products.flatMap((p) =>
                      p.faq.map((f) => (
                        <details key={`${p.sku}-${f.q}`} className="group py-4">
                          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-sm font-semibold text-[#0B0D12]">
                            <span>
                              {f.q}{" "}
                              <span className="text-[#9CA3AF] font-normal">· {p.name}</span>
                            </span>
                            <span className="text-[#6B7280] transition-transform group-open:rotate-45">+</span>
                          </summary>
                          <p className="text-[#6B7280] text-sm leading-relaxed mt-2 pr-6">{f.a}</p>
                          <Link href={p.url} className="inline-block mt-2 text-xs font-bold text-[#2563FF] hover:underline">
                            About {p.name} →
                          </Link>
                        </details>
                      )),
                    )}
                  </div>
                </div>
              );
            })}

            <div className="bg-[#0B0D12] text-white rounded-3xl p-8 flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="font-bold text-xl mb-1" style={{ letterSpacing: "-0.01em" }}>
                  Didn&apos;t find it?
                </p>
                <p className="text-white/65 text-sm">Ask Muse in your own words, or send us a message.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <AskMuseButton
                  prompt="I have a question about my NexaBank products."
                  className="bg-white text-[#0B0D12] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
                />
                <Link
                  href="/contact"
                  className="border border-white/25 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
