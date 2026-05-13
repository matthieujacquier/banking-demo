import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import Link from "next/link";

const cards = [
  {
    name: "NexaRewards Visa",
    tagline: "Earn 2x points on every purchase",
    apr: "15.9%",
    fee: "€0",
    perks: ["2x reward points", "No foreign transaction fees", "Travel insurance included"],
  },
  {
    name: "NexaGold Mastercard",
    tagline: "Premium benefits for premium customers",
    apr: "12.9%",
    fee: "€99/yr",
    perks: ["Concierge service", "Airport lounge access", "5x points on travel"],
  },
  {
    name: "NexaStudent Card",
    tagline: "Build your credit history from day one",
    apr: "19.9%",
    fee: "€0",
    perks: ["No credit history required", "Cashback on groceries", "Free mobile app"],
  },
];

export default function CreditCardsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Products</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Credit Cards</h1>
          <p className="text-[#6B7280] max-w-xl text-lg">
            Find the card that fits your lifestyle. Earn rewards, enjoy benefits, and pay with confidence.
          </p>
        </div>
      </section>

      {/* DY targets this section for personalised card recommendations */}
      <section id="dy-credit-cards-grid" className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.name} className="bg-white rounded-3xl border border-[#D8E0ED] p-7 flex flex-col" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}>
              <div className="bg-[#0B0D12] rounded-2xl h-36 mb-6 flex items-center justify-center">
                <span className="text-[#2563FF] font-bold text-base">{card.name}</span>
              </div>
              <h3 className="font-semibold text-[#0B0D12] text-xl mb-1" style={{ letterSpacing: "-0.01em" }}>{card.name}</h3>
              <p className="text-[#6B7280] text-sm mb-5">{card.tagline}</p>
              <div className="flex gap-6 text-sm mb-5">
                <div><p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest mb-0.5">APR</p><p className="font-semibold text-[#0B0D12]">{card.apr}</p></div>
                <div><p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest mb-0.5">Annual fee</p><p className="font-semibold text-[#0B0D12]">{card.fee}</p></div>
              </div>
              <ul className="text-sm text-[#6B7280] space-y-2 mb-7 flex-1">
                {card.perks.map((p) => (
                  <li key={p} className="flex gap-2 items-start">
                    <span className="text-[#119E5A] font-bold mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block text-center bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
