"use client";

function resetDemo() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    /* ignore */
  }
  window.location.href = "/";
}

export default function Footer() {
  return (
    <footer className="bg-[#0B0D12] text-[#6B7280] text-sm">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-white font-bold text-lg mb-3">Nexa<span className="text-[#2563FF]">Bank</span></p>
          <p className="text-xs leading-relaxed">Banking built for your future. Secure, simple, and always by your side.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Products</p>
          <ul className="space-y-3">
            <li><a href="/products/credit-cards" className="hover:text-white transition-colors">Credit Cards</a></li>
            <li><a href="/products/loans" className="hover:text-white transition-colors">Loans</a></li>
            <li><a href="/products/savings" className="hover:text-white transition-colors">Savings</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Company</p>
          <ul className="space-y-3">
            <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4">Legal</p>
          <ul className="space-y-3">
            <li><span>Privacy Policy</span></li>
            <li><span>Terms of Use</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-xs flex items-center justify-between max-w-7xl mx-auto px-6">
        <span>© {new Date().getFullYear()} NexaBank. Demo purposes only.</span>
        <button
          onClick={resetDemo}
          className="text-white/20 hover:text-white/60 transition-colors text-[10px] tracking-wide"
          title="Clear localStorage + sessionStorage and reload"
        >
          reset demo
        </button>
      </div>
    </footer>
  );
}
