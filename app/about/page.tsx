import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-[#0A1628] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Our story</p>
          <h1 className="text-4xl font-bold mb-4">About NexaBank</h1>
          <p className="text-gray-300 max-w-xl">
            Built on trust, driven by innovation.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 flex-1">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-4">Our mission</h2>
            <p className="text-gray-600 leading-relaxed">
              NexaBank was founded with a single belief: banking should work for you, not against you.
              We combine cutting-edge technology with human expertise to deliver financial solutions
              that are transparent, fair, and tailored to your life.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { year: "2012", label: "Founded" },
              { year: "2M+", label: "Customers" },
              { year: "18", label: "Countries" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-6">
                <p className="text-3xl font-bold text-[#C9A84C] mb-1">{item.year}</p>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-4">Our values</h2>
            <ul className="space-y-4">
              {[
                { title: "Transparency", desc: "No hidden fees, no surprises. Ever." },
                { title: "Innovation", desc: "We invest in the technology that makes your life easier." },
                { title: "Security", desc: "Your money and data are protected by bank-grade security." },
              ].map((v) => (
                <li key={v.title} className="flex gap-4">
                  <span className="text-[#C9A84C] text-xl mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-[#0A1628]">{v.title}</p>
                    <p className="text-gray-500 text-sm">{v.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
