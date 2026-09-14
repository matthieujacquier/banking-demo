"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DYContext from "@/components/DYContext";
import { fireLoginEvent } from "@/lib/dy-script";
import { DEMO_USERS, userFromEmail, writeSessionUser } from "@/lib/session-user";

// Demo sign-in: no credentials are checked. Any email signs you in (and
// becomes the identity DY sees, as a hashed cuid); an empty form signs in the
// default demo customer.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(address: string) {
    if (busy) return;
    setBusy(true);
    const user = userFromEmail(address);
    await fireLoginEvent(user.email);
    writeSessionUser(user);
    router.push("/app/home");
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] flex flex-col items-center justify-center px-6">
      <DYContext context={{ type: "OTHER", data: ["LOGIN"] }} />
      <Link href="/" className="text-2xl font-bold text-white mb-10">
        Nexa<span className="text-[#2563FF]">Bank</span>
      </Link>

      <div className="bg-white rounded-3xl p-8 w-full max-w-sm" style={{ boxShadow: "0 16px 34px rgba(11,13,18,0.2)" }}>
        <h1 className="text-2xl font-bold text-[#0B0D12] mb-1" style={{ letterSpacing: "-0.01em" }}>
          Sign in
        </h1>
        <p className="text-[#6B7280] text-sm mb-7">Welcome back</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn(email);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
              placeholder="your@email.com"
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mt-2 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">Or sign in as</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => signIn(u.email)}
                disabled={busy}
                className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#D8E0ED] text-[#0B0D12] hover:border-[#2563FF]/50 hover:bg-[#F6F7FB] transition-colors disabled:opacity-60"
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#6B7280] text-center mt-6">Demo only · any email signs you in · Not a real bank</p>
      </div>
    </div>
  );
}
