const offers = [
  {
    title: "Premium Credit Card",
    desc: "Upgrade to NexaGold and earn 5x points on every trip.",
    badge: "Exclusive for you",
    cta: "Learn More",
  },
  {
    title: "Personal Loan — Pre-approved",
    desc: "You're pre-approved for up to €25,000 at 4.9% APR.",
    badge: "Pre-approved",
    cta: "Apply Now",
  },
  {
    title: "Fixed Rate ISA",
    desc: "Lock in 4.8% AER for 12 months. Limited availability.",
    badge: "Limited offer",
    cta: "Open Account",
  },
];

export default function OffersPage() {
  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>Your Offers</h1>
        <p className="text-[#6B7280] text-sm mt-1">Personalised just for you</p>
      </div>

      {/* DY hero — server-side personalisation injects content here */}
      <div id="dy-app-offers-hero" className="bg-[#0B0D12] rounded-3xl p-5 text-white min-h-[110px]">
        <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-2">Featured</p>
        <p className="font-bold text-lg" style={{ letterSpacing: "-0.01em" }}>Unlock your next financial move</p>
        <p className="text-[#6B7280] text-sm mt-1">Tailored recommendations based on your profile.</p>
      </div>

      {/* DY offers grid — server-side personalisation injects cards here */}
      <div id="dy-app-offers-grid" className="space-y-4">
        {offers.map((offer) => (
          <div key={offer.title} className="bg-white border border-[#D8E0ED] rounded-3xl p-5" style={{ boxShadow: "0 8px 20px rgba(11,13,18,0.05)" }}>
            <span className="text-xs font-bold text-[#2563FF] uppercase tracking-widest">{offer.badge}</span>
            <h3 className="font-semibold text-[#0B0D12] mt-1 mb-1" style={{ letterSpacing: "-0.01em" }}>{offer.title}</h3>
            <p className="text-[#6B7280] text-sm mb-4">{offer.desc}</p>
            <button className="bg-[#0B0D12] text-white text-sm px-5 py-2.5 rounded-full font-bold hover:bg-[#1A1F2C] transition-colors">
              {offer.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
