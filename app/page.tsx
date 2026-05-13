import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero banner — DY targets this section */}
      <section id="dy-hero-banner" className="bg-[#0B0D12] text-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-sm font-bold uppercase tracking-widest mb-5">Welcome to NexaBank</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight max-w-3xl mb-6" style={{ letterSpacing: "-0.035em" }}>
            Banking built<br />for your future
          </h1>
          <p className="text-[#6B7280] text-lg max-w-xl mb-10 leading-relaxed">
            Open an account in minutes. Manage your money with confidence.
            Personalised offers designed just for you.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/login"
              className="bg-white text-[#0B0D12] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#F6F7FB] transition-colors"
            >
              Open an Account
            </Link>
            <Link
              href="/products/credit-cards"
              className="border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products — DY targets this section */}
      <section id="dy-featured-products" className="py-24 px-6 bg-[#F6F7FB]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-3">Our Products</p>
          <h2 className="text-4xl font-bold text-[#0B0D12] mb-3" style={{ letterSpacing: "-0.02em" }}>
            Solutions for every goal
          </h2>
          <p className="text-[#6B7280] mb-12 text-lg">Tailored to every stage of your life.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Credit Cards",
                desc: "Earn rewards on every purchase. No annual fee on our flagship card.",
                href: "/products/credit-cards",
                icon: "💳",
              },
              {
                title: "Personal Loans",
                desc: "Competitive rates, flexible terms. Get funds in as little as 24 hours.",
                href: "/products/loans",
                icon: "🏦",
              },
              {
                title: "Savings Accounts",
                desc: "High-yield savings with no minimums. Your money works harder.",
                href: "/products/savings",
                icon: "📈",
              },
            ].map((product) => (
              <Link
                key={product.title}
                href={product.href}
                className="bg-white rounded-3xl p-8 border border-[#D8E0ED] hover:shadow-[0_16px_34px_rgba(11,13,18,0.08)] transition-all group"
              >
                <div className="text-3xl mb-5">{product.icon}</div>
                <h3 className="text-xl font-semibold text-[#0B0D12] mb-2 group-hover:text-[#2563FF] transition-colors" style={{ letterSpacing: "-0.01em" }}>
                  {product.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{product.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional banner — DY targets this section */}
      <section id="dy-promotional-banner" className="bg-[#2563FF] py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-2xl font-bold mb-1" style={{ letterSpacing: "-0.01em" }}>Limited time offer</h3>
            <p className="text-white/70 text-sm">Get 3 months fee-free on any new account opened this month.</p>
          </div>
          <Link
            href="/login"
            className="bg-white text-[#2563FF] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#E7EEFF] transition-colors whitespace-nowrap"
          >
            Claim Offer
          </Link>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            { stat: "2M+", label: "Customers worldwide" },
            { stat: "€50B+", label: "Assets under management" },
            { stat: "99.9%", label: "Platform uptime" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-5xl font-bold text-[#0B0D12] mb-2" style={{ letterSpacing: "-0.025em" }}>{item.stat}</p>
              <p className="text-[#6B7280]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
