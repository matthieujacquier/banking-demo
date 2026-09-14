import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import ProductCard from "@/components/website/ProductCard";
import { getProduct, type Product } from "@/lib/products";

const MILESTONES: { title: string; body: string; skus: string[] }[] = [
  { title: "A new arrival", body: "Start a savings account and an investment plan in their name — gifts from family go straight in.", skus: ["SAV-JUN-001", "INV-JUN-001", "INS-LIFE-001"] },
  { title: "Ages 6–12", body: "Pocket money on a card you control, chores, and savings goals they can watch grow.", skus: ["ACC-KIDS-001", "SAV-JUN-001"] },
  { title: "Ages 13–17", body: "A real account for part-time wages and independence, with you in the loop.", skus: ["ACC-TEEN-001", "INV-JUN-001"] },
  { title: "Running the household", body: "Two cards, shared budgets, and cover for the home and the people in it.", skus: ["ACC-JOINT-001", "INS-HOME-001", "CASH-CARD-001"] },
  { title: "Buying or upgrading a home", body: "Mortgage advice, a mortgage, and a lower rate for making the home greener.", skus: ["SVC-MORT-001", "LOAN-REAL-001", "LOAN-GREEN-001"] },
  { title: "Planning ahead", body: "Protect income, build a pension, and put money aside without locking it away.", skus: ["INS-INC-001", "SAV-PEN-001", "SAV-NOT-001"] },
];

// Family & kids hub — the personas `family` and `kids_teens`.
export default function FamilyHubPage() {
  const featured = ["ACC-JOINT-001", "ACC-KIDS-001", "ACC-TEEN-001", "SAV-JUN-001", "INV-JUN-001", "INS-LIFE-001"]
    .map(getProduct)
    .filter((p): p is Product => !!p);

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["FAMILY"] }} />
      <Navbar />

      <section id="dy-family-hero" className="relative bg-[#0B0D12] text-white py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 30%, #0D948844 0%, #0B0D12 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-[#2DD4BF] text-xs font-bold uppercase tracking-widest mb-4">Family &amp; kids</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
            Money for the whole family, from the first piggy bank to the first home.
          </h1>
          <p className="text-white/70 max-w-2xl text-lg mb-10">
            Joint accounts, kids&rsquo; cards with parental controls, junior savings at 4% AER, and the cover, mortgage and
            pension that come later — all in the one app you already use.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products/accounts/nexakids-account"
              className="bg-white text-[#0B0D12] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
            >
              Open a NexaKids account
            </Link>
            <Link
              href="/products/accounts/joint-account"
              className="border border-white/25 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
            >
              Set up a joint account
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#F6F7FB]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0D9488] text-xs font-bold uppercase tracking-widest mb-3">Money milestones</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B0D12] mb-10" style={{ letterSpacing: "-0.025em" }}>
            The right product at every stage
          </h2>
          <ol className="relative border-l-2 border-[#D8E0ED] ml-3 space-y-10">
            {MILESTONES.map((m, i) => (
              <li key={m.title} className="pl-8 relative">
                <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#0D9488] border-4 border-[#F6F7FB]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-1">Step {i + 1}</p>
                <h3 className="font-bold text-[#0B0D12] text-xl mb-1" style={{ letterSpacing: "-0.01em" }}>
                  {m.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-3 max-w-2xl">{m.body}</p>
                <div className="flex flex-wrap gap-2">
                  {m.skus.map((sku) => {
                    const p = getProduct(sku);
                    return p ? (
                      <Link
                        key={sku}
                        href={p.url}
                        className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#D8E0ED] text-[#0B0D12] hover:border-[#2563FF]/50"
                      >
                        {p.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="dy-family-products" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B0D12] mb-8" style={{ letterSpacing: "-0.025em" }}>
            Made for families
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
