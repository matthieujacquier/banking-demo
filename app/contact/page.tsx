import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";

const contactMethods = [
  { label: "Phone", value: "+1 800 NEXA BANK", sub: "Mon–Fri, 8am–8pm" },
  { label: "Email", value: "support@nexabank.demo", sub: "Response within 24h" },
  { label: "Live Chat", value: "Available in the app", sub: "24/7 support" },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["CONTACT"] }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Get in touch</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>Contact Us</h1>
          <p className="text-[#6B7280] max-w-xl text-lg">We&apos;re here to help, 24/7.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">

          {/* Contact methods */}
          <div className="space-y-4">
            {contactMethods.map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-3xl border border-[#D8E0ED] p-6"
                style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
              >
                <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-2">{c.label}</p>
                <p className="font-bold text-[#0B0D12] text-lg mb-0.5" style={{ letterSpacing: "-0.01em" }}>{c.value}</p>
                <p className="text-[#6B7280] text-sm">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div
            className="bg-white rounded-3xl border border-[#D8E0ED] p-8"
            style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
          >
            <h2 className="text-xl font-bold text-[#0B0D12] mb-6" style={{ letterSpacing: "-0.01em" }}>Send a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
