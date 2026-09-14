// "★ 4.7 · 2,140 reviews" — customer rating line used on cards and detail pages.
export default function Rating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count: number;
  size?: "sm" | "md";
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${size === "md" ? "text-sm" : "text-xs"} text-[#6B7280]`}
      aria-label={`Rated ${rating} out of 5 from ${count} reviews`}
    >
      <span className="relative inline-block leading-none text-[#D8E0ED]" aria-hidden="true">
        ★★★★★
        <span className="absolute inset-0 overflow-hidden text-[#F59E0B]" style={{ width: `${pct}%` }}>
          ★★★★★
        </span>
      </span>
      <span className="font-semibold text-[#0B0D12]">{rating.toFixed(1)}</span>
      <span>· {count.toLocaleString("en-IE")} reviews</span>
    </span>
  );
}
