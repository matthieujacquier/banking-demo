"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DYContext from "@/components/DYContext";

export default function DashboardPage() {
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    const stored = sessionStorage.getItem("nexabank_user");
    if (stored) setUserName(JSON.parse(stored).name.split(" ")[0]);
  }, []);

  const transactions = [
    { label: "Netflix", amount: "-€15.99", date: "Today", type: "debit" },
    { label: "Salary", amount: "+€3,200.00", date: "Yesterday", type: "credit" },
    { label: "Grocery Store", amount: "-€67.40", date: "12 May", type: "debit" },
    { label: "Transfer", amount: "+€500.00", date: "11 May", type: "credit" },
    { label: "Coffee", amount: "-€4.50", date: "10 May", type: "debit" },
  ];

  return (
    <div className="px-5 py-6 space-y-6">
      <DYContext context={{ type: "OTHER", data: ["DASHBOARD"] }} />
      <div>
        <p className="text-[#6B7280] text-sm">Good morning,</p>
        <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>{userName}</h1>
      </div>

      {/* Balance card */}
      <div className="bg-[#0B0D12] rounded-3xl p-5 text-white">
        <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest mb-1">Total balance</p>
        <p className="text-3xl font-bold mb-5" style={{ letterSpacing: "-0.02em" }}>€12,480.50</p>
        <div className="flex justify-between text-xs">
          <div>
            <p className="text-[#6B7280] uppercase tracking-widest font-bold mb-0.5">Income</p>
            <p className="font-semibold text-[#119E5A]">+€3,700.00</p>
          </div>
          <div>
            <p className="text-[#6B7280] uppercase tracking-widest font-bold mb-0.5">Expenses</p>
            <p className="font-semibold text-white">-€1,240.30</p>
          </div>
        </div>
      </div>

      {/* DY dashboard widget */}
      <div id="dy-app-dashboard-widget" />

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Send", icon: "↑" },
          { label: "Receive", icon: "↓" },
          { label: "Pay", icon: "⊕" },
          { label: "More", icon: "…" },
        ].map((action) => (
          <button key={action.label} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#F6F7FB] flex items-center justify-center text-[#0B0D12] font-bold text-lg border border-[#D8E0ED]">
              {action.icon}
            </div>
            <span className="text-xs text-[#6B7280] font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#0B0D12]">Recent Transactions</h2>
          <span className="text-xs text-[#2563FF] font-bold">See all</span>
        </div>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.label + tx.date} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F6F7FB] border border-[#D8E0ED] flex items-center justify-center text-sm text-[#0B0D12]">
                  {tx.type === "credit" ? "↓" : "↑"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0B0D12]">{tx.label}</p>
                  <p className="text-xs text-[#6B7280]">{tx.date}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${tx.type === "credit" ? "text-[#119E5A]" : "text-[#0B0D12]"}`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nudge to offers */}
      <Link
        href="/app/offers"
        className="block bg-[#E7EEFF] border border-[#2563FF]/20 rounded-2xl p-4 text-center"
      >
        <p className="text-sm font-bold text-[#0B0D12]">You have personalised offers waiting</p>
        <p className="text-xs text-[#6B7280] mt-1">Tap to view →</p>
      </Link>
    </div>
  );
}
