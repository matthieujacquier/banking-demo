import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["CONTACT"] }} />
      <Navbar />

      <section className="bg-[#0A1628] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Get in touch</p>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-xl">We&apos;re here to help, 24/7.</p>
        </div>
      </section>

      <section className="py-20 px-6 flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {[
              { label: "Phone", value: "+1 800 NEXA BANK", sub: "Mon–Fri 8am–8pm" },
              { label: "Email", value: "support@nexabank.demo", sub: "Response within 24h" },
              { label: "Live Chat", value: "Available in the app", sub: "24/7 support" },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
                <p className="font-bold text-[#0A1628] text-lg">{c.value}</p>
                <p className="text-gray-500 text-sm">{c.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-[#0A1628] mb-6">Send a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full name</label>
                <input type="text" className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Message</label>
                <textarea rows={4} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="How can we help?" />
              </div>
              <button type="submit" className="w-full bg-[#0A1628] text-white py-2 rounded font-semibold hover:bg-[#0d1f3c] transition-colors">
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
