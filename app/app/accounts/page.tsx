"use client";

import { useDYPageview } from "@/lib/dy-client";
import { ACCOUNTS, CARD, TRANSACTIONS, formatEUR, type Transaction } from "@/lib/app-data";
import TransactionRow from "@/components/app/TransactionRow";

export default function AccountsPage() {
  useDYPageview("OTHER", ["ACCOUNTS"]);

  const groups: { label: string; items: Transaction[] }[] = [];
  for (const tx of TRANSACTIONS) {
    let group = groups.find((g) => g.label === tx.group);
    if (!group) {
      group = { label: tx.group, items: [] };
      groups.push(group);
    }
    group.items.push(tx);
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
        Accounts
      </h1>

      {/* Accounts */}
      <div className="space-y-3">
        {ACCOUNTS.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-2xl border border-[#D8E0ED] p-4"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#0B0D12]">{account.name}</p>
                <p className="text-xs text-[#6B7280] font-mono mt-0.5">{account.iban}</p>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  color: account.type === "current" ? "#2563FF" : "#16A34A",
                  background: account.type === "current" ? "#E7EEFF" : "#16A34A18",
                }}
              >
                {account.type}
              </span>
            </div>
            <p
              className="text-2xl font-bold text-[#0B0D12] mt-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              {formatEUR(account.balance)}
            </p>
          </div>
        ))}
      </div>

      {/* Card */}
      <div>
        <h2 className="font-bold text-[#0B0D12] mb-3" style={{ letterSpacing: "-0.01em" }}>
          My card
        </h2>
        <div
          className="rounded-2xl h-44 p-5 relative overflow-hidden flex flex-col justify-between"
          style={{ background: CARD.gradient }}
        >
          <div
            className="w-10 h-7 rounded"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
          <div>
            <p className="text-white font-mono text-lg tracking-widest">
              •••• •••• •••• {CARD.last4}
            </p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-white font-bold text-sm">{CARD.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Expires {CARD.expiry}
                </p>
              </div>
              <div className="flex">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                />
                <div
                  className="w-6 h-6 rounded-full -ml-2.5"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="font-bold text-[#0B0D12] mb-3" style={{ letterSpacing: "-0.01em" }}>
          Transactions
        </h2>
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">
                {group.label}
              </p>
              <div className="space-y-4">
                {group.items.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
