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
        { label: "NexaStart", href: "/products/credit-cards/nexa-start" },
        { label: "NexaEssential", href: "/products/credit-cards/nexa-essential" },
        { label: "NexaNomad", href: "/products/credit-cards/nexa-nomad" },
        { label: "NexaPrestige", href: "/products/credit-cards/nexa-prestige" },
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
        { label: "Instant Access", href: "/products/savings/instant-access" },
        { label: "Notice Account", href: "/products/savings/notice-account" },
        { label: "Term Deposit", href: "/products/savings/term-deposit" },
        { label: "Regulated", href: "/products/savings/regulated-savings" },
        { label: "Pension Plan", href: "/products/savings/pension-savings" },
      ],
    },
    {
      heading: "Investments",
      href: "/products/investments",
      items: [
        { label: "Managed Funds", href: "/products/investments/managed-funds" },
        { label: "ETFs", href: "/products/investments/etfs" },
        { label: "Robo-Advisory", href: "/products/investments/robo-advisory" },
        { label: "Investment Pension", href: "/products/investments/investment-pension" },
      ],
    },
  ],
  [
    {
      heading: "Insurance",
      href: "/products/insurance",
      items: [
        { label: "Life Insurance", href: "/products/insurance/life-insurance" },
        { label: "Home Insurance", href: "/products/insurance/home-insurance" },
        { label: "Travel Insurance", href: "/products/insurance/travel-insurance" },
        { label: "Income Protection", href: "/products/insurance/income-protection" },
      ],
    },
    {
      heading: "Crypto",
      href: "/products/crypto",
      items: [
        { label: "Bitcoin", href: "/products/crypto/bitcoin" },
        { label: "Ethereum", href: "/products/crypto/ethereum" },
        { label: "Portfolio", href: "/products/crypto/crypto-portfolio" },
        { label: "Staking", href: "/products/crypto/crypto-staking" },
      ],
    },
    {
      heading: "Cashback",
      href: "/products/cashback",
      items: [
        { label: "Cashback Card", href: "/products/cashback/cashback-card" },
        { label: "Rewards Programme", href: "/products/cashback/rewards-programme" },
      ],
    },
    {
      heading: "Private Banking",
      href: "/products/private-banking",
      items: [
        { label: "Relationship Manager", href: "/products/private-banking/relationship-manager" },
        { label: "Wealth Planning", href: "/products/private-banking/wealth-planning" },
        { label: "Credit Line", href: "/products/private-banking/credit-line" },
      ],
    },
  ],
];

export default function Navbar() {
  return (
    <nav className="bg-[#0B0D12] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-white flex-shrink-0 font-[var(--font-outfit)] italic font-extrabold text-2xl"
          style={{ letterSpacing: "-0.025em" }}
        >
          NEXA
        </Link>

        <div id="dy-nav-links" className="hidden md:flex items-center gap-8 text-sm font-medium text-white/65 h-16">

          {/* Products mega-menu */}
          <div id="dy-nav-products" className="group relative h-full flex items-center">
            <span className="flex items-center gap-1 cursor-default hover:text-white transition-colors select-none">
              Products
              <span className="transition-transform duration-200 group-hover:rotate-180 flex items-center">
                <ChevronDown />
              </span>
            </span>
            {/* Dropdown panel — no gap so hover bridge is seamless */}
            <div className="absolute top-full left-0 hidden group-hover:block z-50 w-[660px]">
              <div
                className="mt-0 bg-[#0B0D12] rounded-2xl border border-white/10 p-6 grid grid-cols-3 gap-x-8 gap-y-0"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
              >
                {megaColumns.map((col, ci) => (
                  <div key={ci} className="space-y-5">
                    {col.map((group) => (
                      <div key={group.heading}>
                        <Link
                          href={group.href}
                          className="block text-xs font-bold uppercase tracking-widest text-white mb-2 hover:text-white/80 transition-colors"
                        >
                          {group.heading}
                        </Link>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                className="text-sm text-white/55 hover:text-white transition-colors block py-0.5"
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

          <Link href="/#plans" className="hover:text-white transition-colors">Plans</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="hidden sm:inline-flex border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white/5 hover:border-white/50 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/products/credit-cards"
            className="bg-white text-[#0B0D12] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#F6F7FB] transition-colors"
          >
            Open account
          </Link>
        </div>
      </div>
    </nav>
  );
}
