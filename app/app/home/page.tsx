"use client";

import { useState } from "react";
import Link from "next/link";
import { useDYPageview } from "@/lib/dy-client";
import {
  ADVANTAGES,
  MONTH_EXPENSES,
  MONTH_INCOME,
  TRANSACTIONS,
  formatEUR,
  totalBalance,
} from "@/lib/app-data";
import TransactionRow from "@/components/app/TransactionRow";

const QUICK_ACTIONS = [
  { label: "Send", icon: "↑" },
  { label: "Request", icon: "↓" },
  { label: "Pay", icon: "⊕" },
  { label: "Top up", icon: "+" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function readFirstName(): string {
  try {
    const stored = sessionStorage.getItem("nexabank_user");
    if (!stored) return "there";
    return (JSON.parse(stored).name as string).split(" ")[0] || "there";
  } catch {
    return "there";
  }
}

export default function HomePage() {
  useDYPageview("HOMEPAGE", ["HOME"]);
  const [name] = useState(readFirstName);
  const advantagesTotal = ADVANTAGES.reduce((s, a) => s + a.earned, 0);

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <p className="text-[#6B7280] text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
          {name}
        </h1>
      </div>

      {/* Balance hero */}
      <div className="bg-[#0B0D12] rounded-3xl p-5 text-white">
        <p className="text-white/45 text-xs font-bold uppercase tracking-widest mb-1">
          Total balance
        </p>
        <p className="text-3xl font-bold mb-5" style={{ letterSpacing: "-0.02em" }}>
          {formatEUR(totalBalance())}
        </p>
        <div className="flex justify-between text-xs">
          <div>
            <p className="text-white/45 uppercase tracking-widest font-bold mb-0.5">Income</p>
            <p className="font-semibold text-[#4ADE80]">+{formatEUR(MONTH_INCOME)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/45 uppercase tracking-widest font-bold mb-0.5">Spent</p>
            <p className="font-semibold text-white">-{formatEUR(MONTH_EXPENSES)}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button key={action.label} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#F6F7FB] flex items-center justify-center text-[#0B0D12] font-bold text-lg border border-[#D8E0ED]">
              {action.icon}
            </div>
            <span className="text-[11px] text-[#6B7280] font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
            Recent activity
          </h2>
          <Link href="/app/accounts" className="text-xs text-[#2563FF] font-bold">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {TRANSACTIONS.slice(0, 4).map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      </div>

      {/* Advantages snapshot */}
      <Link
        href="/app/advantages"
        className="block bg-[#E7EEFF] border border-[#2563FF]/20 rounded-2xl p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0B0D12]">My advantages</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {formatEUR(advantagesTotal)} earned in rewards & cashback
            </p>
          </div>
          <span className="text-[#2563FF] font-bold">→</span>
        </div>
      </Link>
    </div>
  );
}
