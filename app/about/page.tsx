import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["ABOUT"] }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Our story</p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>About NexaBank</h1>
          <p className="text-[#6B7280] max-w-xl text-lg">Built on trust, driven by innovation.</p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#F6F7FB] border-b border-[#D8E0ED] py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "2012", label: "Year founded" },
            { value: "2M+", label: "Customers worldwide" },
            { value: "18", label: "Countries served" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold text-[#0B0D12] mb-1" style={{ letterSpacing: "-0.025em" }}>{item.value}</p>
              <p className="text-[#6B7280] text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission + Values */}
      <section className="py-20 px-6 bg-white flex-1">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Mission */}
          <div
            className="bg-white rounded-3xl border border-[#D8E0ED] p-8"
            style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
          >
            <h2 className="text-2xl font-bold text-[#0B0D12] mb-4" style={{ letterSpacing: "-0.015em" }}>Our mission</h2>
            <p className="text-[#6B7280] leading-relaxed">
              NexaBank was founded with a single belief: banking should work for you, not against you.
              We combine cutting-edge technology with human expertise to deliver financial solutions
              that are transparent, fair, and tailored to your life.
            </p>
          </div>

          {/* Values */}
          <div
            className="bg-white rounded-3xl border border-[#D8E0ED] p-8"
            style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.07)" }}
          >
            <h2 className="text-2xl font-bold text-[#0B0D12] mb-6" style={{ letterSpacing: "-0.015em" }}>Our values</h2>
            <ul className="space-y-5">
              {[
                { title: "Transparency", desc: "No hidden fees, no surprises. Ever." },
                { title: "Innovation", desc: "We invest in the technology that makes your life easier." },
                { title: "Security", desc: "Your money and data are protected by bank-grade security." },
              ].map((v) => (
                <li key={v.title} className="flex gap-4 items-start">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(37,99,255,0.1)" }}
                  >
                    <span className="text-[#2563FF] font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B0D12] mb-0.5">{v.title}</p>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{v.desc}</p>
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
