"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DYContext from "@/components/DYContext";
import { fireLoginEvent } from "@/lib/dy-script";

const DEMO_USERS = [
  { email: "matthieu.jacquier@mastercard.com", password: "demo1234", name: "Matthieu Jacquier" },
  { email: "jane.smith@demo.com", password: "demo1234", name: "Jane Smith" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (user) {
      await fireLoginEvent(user.email);
      sessionStorage.setItem(
        "nexabank_user",
        JSON.stringify({ name: user.name, email: user.email }),
      );
      router.push("/app/home");
    } else {
      setError("Invalid credentials. Try matthieu.jacquier@mastercard.com / demo1234");
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] flex flex-col items-center justify-center px-6">
      <DYContext context={{ type: "OTHER", data: ["LOGIN"] }} />
      <Link href="/" className="text-2xl font-bold text-white mb-10">
        Nexa<span className="text-[#2563FF]">Bank</span>
      </Link>

      <div className="bg-white rounded-3xl p-8 w-full max-w-sm" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.2)" }}>
        <h1 className="text-2xl font-bold text-[#0B0D12] mb-1" style={{ letterSpacing: "-0.01em" }}>Sign in</h1>
        <p className="text-[#6B7280] text-sm mb-7">Welcome back</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-[#D14343] text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-[#6B7280] text-center mt-6">
          Demo only · Not a real bank
        </p>
      </div>
    </div>
  );
}
