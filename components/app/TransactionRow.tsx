import { formatEUR, type Transaction } from "@/lib/app-data";

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const credit = tx.amount > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-[#F6F7FB] border border-[#D8E0ED] flex items-center justify-center text-sm text-[#0B0D12] flex-shrink-0">
          {credit ? "↓" : "↑"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0B0D12] truncate">{tx.merchant}</p>
          <p className="text-xs text-[#6B7280]">{tx.category}</p>
        </div>
      </div>
      <span
        className={`text-sm font-bold flex-shrink-0 ${
          credit ? "text-[#119E5A]" : "text-[#0B0D12]"
        }`}
      >
        {credit ? "+" : ""}
        {formatEUR(tx.amount)}
      </span>
    </div>
  );
}
