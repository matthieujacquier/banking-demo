"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDY, useDYPageview } from "@/lib/dy-client";

const SLOTS = ["This afternoon", "Tomorrow morning", "Tomorrow afternoon", "Next week"];

function readProfile() {
  const fallback = {
    name: "Matthieu Jacquier",
    email: "matthieu.jacquier@mastercard.com",
  };
  try {
    const u = JSON.parse(sessionStorage.getItem("nexabank_user") ?? "{}") as {
      name?: string;
      email?: string;
    };
    return { name: u.name ?? fallback.name, email: u.email ?? fallback.email };
  } catch {
    return fallback;
  }
}

export default function ContactPage() {
  useDYPageview("OTHER", ["CONTACT"]);
  const dy = useDY();
  const router = useRouter();

  const [profile] = useState(readProfile);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState("+32 470 12 34 56");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [topic, setTopic] = useState("Investments review");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    dy.event("Advisor Contact Request", "Advisor Contact Request", {
      topic,
      slot,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="px-5 py-10 flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-5"
          style={{ background: "#16A34A" }}
        >
          ✓
        </div>
        <h1 className="text-xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.01em" }}>
          We&apos;ll be in touch
        </h1>
        <p className="text-[#6B7280] text-sm mt-2 max-w-[260px]">
          Thanks {name.split(" ")[0]} — one of our advisors will reach out for{" "}
          <span className="font-semibold">{slot.toLowerCase()}</span>.
        </p>
        <button
          onClick={() => router.push("/app/investments")}
          className="mt-7 w-full bg-[#0B0D12] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
        >
          Back to investments
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-5">
      <div>
        <p className="text-[#6B7280] text-sm">Book a call</p>
        <h1 className="text-2xl font-bold text-[#0B0D12]" style={{ letterSpacing: "-0.02em" }}>
          Talk to an advisor
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Tell us when works for you and we&apos;ll call you back.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {[
          { label: "Full name", value: name, set: setName, type: "text" },
          { label: "Email", value: email, set: setEmail, type: "email" },
          { label: "Phone", value: phone, set: setPhone, type: "tel" },
          { label: "Topic", value: topic, set: setTopic, type: "text" },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
              {f.label}
            </label>
            <input
              type={f.type}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="w-full border border-[#D8E0ED] rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#2563FF] focus:shadow-[0_0_0_4px_rgba(159,185,255,0.35)] transition-all"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
            Preferred time
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={`text-xs font-semibold rounded-2xl px-3 py-2.5 border transition-colors ${
                  slot === s
                    ? "bg-[#0B0D12] text-white border-[#0B0D12]"
                    : "bg-white text-[#6B7280] border-[#D8E0ED] hover:border-[#2563FF]/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0B0D12] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors mt-1"
        >
          Request a call
        </button>
        <p className="text-center text-[#6B7280] text-[11px]">
          Fires an <span className="font-semibold">Advisor Contact Request</span> event
        </p>
      </form>
    </div>
  );
}
