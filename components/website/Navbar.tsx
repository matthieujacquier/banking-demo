import Link from "next/link";

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const megaColumns = [
  [
    {
      heading: "Credit Cards",
      href: "/products/credit-cards",
      items: [
        { label: "NexaStart", href: "/products/credit-cards" },
        { label: "NexaEssential", href: "/products/credit-cards" },
        { label: "NexaNomad", href: "/products/credit-cards" },
        { label: "NexaPrestige", href: "/products/credit-cards" },
      ],
    },
    {
      heading: "Loans",
      href: "/products/loans",
      items: [
        { label: "Real Estate", href: "/products/loans/real-estate-loan" },
        { label: "Vehicle", href: "/products/loans/car-loan" },
        { label: "Short Term", href: "/products/loans/short-term-loan" },
        { label: "Student", href: "/products/loans/student-loan" },
        { label: "Renovation", href: "/products/loans/renovation-loan" },
      ],
    },
  ],
  [
    {
      heading: "Savings",
      href: "/products/savings",
      items: [
        { label: "Instant Access", href: "/products/savings" },
        { label: "Notice Account", href: "/products/savings" },
        { label: "Term Deposit", href: "/products/savings" },
        { label: "Regulated", href: "/products/savings" },
        { label: "Pension Plan", href: "/products/savings" },
      ],
    },
    {
      heading: "Investments",
      href: "/products/investments",
      items: [
        { label: "Managed Funds", href: "/products/investments" },
        { label: "ETFs", href: "/products/investments" },
        { label: "Robo-Advisory", href: "/products/investments" },
        { label: "Investment Pension", href: "/products/investments" },
      ],
    },
  ],
  [
    {
      heading: "Insurance",
      href: "/products/insurance",
      items: [
        { label: "Life Insurance", href: "/products/insurance" },
        { label: "Home Insurance", href: "/products/insurance" },
        { label: "Travel Insurance", href: "/products/insurance" },
        { label: "Income Protection", href: "/products/insurance" },
      ],
    },
    {
      heading: "Crypto",
      href: "/products/crypto",
      items: [
        { label: "Bitcoin", href: "/products/crypto" },
        { label: "Ethereum", href: "/products/crypto" },
        { label: "Portfolio", href: "/products/crypto" },
        { label: "Staking", href: "/products/crypto" },
      ],
    },
    {
      heading: "Cashback",
      href: "/products/cashback",
      items: [
        { label: "Rewards Programme", href: "/products/cashback" },
      ],
    },
    {
      heading: "Private Banking",
      href: "/products/private-banking",
      items: [
        { label: "Relationship Manager", href: "/products/private-banking" },
        { label: "Wealth Planning", href: "/products/private-banking" },
        { label: "Credit Line", href: "/products/private-banking" },
      ],
    },
  ],
];

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-[#D8E0ED] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#0B0D12] flex-shrink-0">
          Nexa<span className="text-[#2563FF]">Bank</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1F2937] h-16">

          {/* Products mega-menu */}
          <div className="group relative h-full flex items-center">
            <span className="flex items-center gap-1 cursor-default hover:text-[#2563FF] transition-colors select-none">
              Products
              <span className="transition-transform duration-200 group-hover:rotate-180 flex items-center">
                <ChevronDown />
              </span>
            </span>
            {/* Dropdown panel — no gap so hover bridge is seamless */}
            <div className="absolute top-full left-0 hidden group-hover:block z-50 w-[660px]">
              <div
                className="mt-0 bg-white rounded-2xl border border-[#D8E0ED] p-6 grid grid-cols-3 gap-x-8 gap-y-0"
                style={{ boxShadow: "0 16px 48px rgba(11,13,18,0.12)" }}
              >
                {megaColumns.map((col, ci) => (
                  <div key={ci} className="space-y-5">
                    {col.map((group) => (
                      <div key={group.heading}>
                        <Link
                          href={group.href}
                          className="block text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-2 hover:text-[#1746D1] transition-colors"
                        >
                          {group.heading}
                        </Link>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                className="text-sm text-[#6B7280] hover:text-[#0B0D12] transition-colors block py-0.5"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/#plans" className="hover:text-[#2563FF] transition-colors">Plans</Link>
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
