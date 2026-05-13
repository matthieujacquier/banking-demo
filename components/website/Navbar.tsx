import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-[#D8E0ED] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#0B0D12]">
          Nexa<span className="text-[#2563FF]">Bank</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1F2937]">
          <Link href="/products/credit-cards" className="hover:text-[#2563FF] transition-colors">Credit Cards</Link>
          <Link href="/products/loans" className="hover:text-[#2563FF] transition-colors">Loans</Link>
          <Link href="/products/savings" className="hover:text-[#2563FF] transition-colors">Savings</Link>
          <Link href="/about" className="hover:text-[#2563FF] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#2563FF] transition-colors">Contact</Link>
        </div>
        <Link
          href="/login"
          className="bg-[#0B0D12] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1A1F2C] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
