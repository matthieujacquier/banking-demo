"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDY, useDYPageview } from "@/lib/dy-client";
import { loadIdentity, type DYIdentity } from "@/lib/dy-user";
import { CATEGORIES, type Goal, type Persona } from "@/lib/products";
import { GOAL_VALUES } from "@/lib/catalog/types";
import { GOAL_LABEL, PERSONA_LABEL } from "@/lib/catalog-config";
import { loadProfile, saveProfile, type Household } from "@/lib/profile";
import { clearSessionUser, readSessionUser, DEFAULT_USER } from "@/lib/session-user";

const SETTINGS = ["Notifications", "Privacy & Security", "Payment Methods", "Help & Support"];
const LIFE_STAGES: Persona[] = ["student", "young_professional", "family", "pre_retirement", "hnw", "crypto", "business", "kids_teens"];
const HOUSEHOLDS: { id: Household; label: string }[] = [
  { id: "single", label: "Just me" },
  { id: "couple", label: "Couple" },
  { id: "family", label: "Family" },
];

function truncate(value?: string): string {
  if (!value) return "—";
  return value.length > 22 ? `${value.slice(0, 22)}…` : value;
}

function riskWord(level: number): string {
  if (level <= 3) return "Cautious";
  if (level <= 6) return "Balanced";
  if (level <= 8) return "Adventurous";
  return "Aggressive";
}

export default function ProfilePage() {
  useDYPageview("OTHER", ["PROFILE"]);
  const router = useRouter();
  const dy = useDY();
  const [user] = useState(() => readSessionUser() ?? DEFAULT_USER);
  const [identity, setIdentity] = useState<DYIdentity>({});

  // Financial profile — persisted locally, sent to DY on save.
  const [initial] = useState(loadProfile);
  const [risk, setRisk] = useState(initial.riskAppetite ?? 5);
  const [goals, setGoals] = useState<Goal[]>(initial.goals ?? []);
  const [lifeStage, setLifeStage] = useState<Persona | "">(initial.lifeStage ?? "");
  const [household, setHousehold] = useState<Household | "">(initial.household ?? "");
  const [interests, setInterests] = useState<string[]>(initial.interests ?? []);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const tick = () => setIdentity(loadIdentity());
    const interval = setInterval(tick, 1200);
    tick();
    return () => clearInterval(interval);
  }, []);

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function save() {
    const profile = saveProfile({
      riskAppetite: risk,
      goals,
      lifeStage: lifeStage || undefined,
      household: household || undefined,
      interests,
    });
    // Affinities use feed attribute names; the rest travels as a custom event
    // (and as pageAttributes on every choose / search / Muse call).
    dy.informAffinity([
      { attribute: "categories", values: interests },
      { attribute: "goals", values: goals },
      { attribute: "personas", values: lifeStage ? [lifeStage] : [] },
    ]);
    dy.event("Financial Profile Updated", "Financial Profile Updated", {
      risk_level: profile.riskAppetite,
      life_stage: profile.lifeStage ?? null,
      household: profile.household ?? null,
      goals: goals.join("|"),
    });
    setSaved(true);
  }

  function handleLogout() {
    clearSessionUser();
    router.push("/");
  }

  const dyRows = [
    { label: "DY ID", value: truncate(identity.dyid) },
    { label: "Session", value: truncate(identity.session) },
    { label: "CUID (hashed email)", value: truncate(identity.cuid) },
  ];

  const chip = (active: boolean) =>
    `text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
      active ? "bg-[#2563FF] text-white border-[#2563FF]" : "bg-white text-[#6B7280] border-[#D8E0ED]"
    }`;

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Identity */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#0B0D12] flex items-center justify-center text-[#2563FF] text-2xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[#0B0D12] text-lg truncate" style={{ letterSpacing: "-0.01em" }}>
            {user.name}
          </p>
          <p className="text-[#6B7280] text-sm truncate">{user.email}</p>
        </div>
      </div>

      {/* DY identity */}
      <div>
        <p className="text-[11px] text-[#6B7280] uppercase tracking-widest font-bold mb-3">
          Dynamic Yield identity
        </p>
        <div className="bg-[#0B0D12] rounded-2xl p-4 space-y-2.5">
          {dyRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3 text-xs">
              <span className="text-white/45">{row.label}</span>
              <span className="font-mono text-white truncate">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">
          Captured from DY responses and the Login / Identify events. The CUID is a
          SHA-256 hash of your email — no personal data leaves the device unhashed.
        </p>
      </div>

      {/* Financial profile */}
      <div className="bg-[#F6F7FB] rounded-2xl border border-[#D8E0ED] p-4 space-y-5">
        <div>
          <p className="text-[11px] text-[#6B7280] uppercase tracking-widest font-bold">Financial profile</p>
          <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
            Drives recommendations, search and Muse. Sent to DY as affinities and page attributes.
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="font-semibold text-[#0B0D12]">Risk appetite</span>
            <span className="text-[#6B7280]">
              {risk}/10 · {riskWord(risk)}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={risk}
            onChange={(e) => {
              setRisk(Number(e.target.value));
              setSaved(false);
            }}
            className="w-full accent-[#2563FF]"
            aria-label="Risk appetite from 1 to 10"
          />
          <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1">
            <span>Keep it safe</span>
            <span>Maximise growth</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#0B0D12] mb-2">Goals</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_VALUES.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGoals((prev) => toggle(prev, g));
                  setSaved(false);
                }}
                className={chip(goals.includes(g))}
              >
                {GOAL_LABEL[g]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-[#0B0D12] mb-1.5 block">Life stage</span>
            <select
              value={lifeStage}
              onChange={(e) => {
                setLifeStage(e.target.value as Persona | "");
                setSaved(false);
              }}
              className="w-full bg-white border border-[#D8E0ED] rounded-xl px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#2563FF]"
            >
              <option value="">Not set</option>
              {LIFE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {PERSONA_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="text-xs font-semibold text-[#0B0D12] mb-1.5 block">Household</span>
            <div className="flex gap-1.5">
              {HOUSEHOLDS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setHousehold(h.id);
                    setSaved(false);
                  }}
                  className={`flex-1 text-[11px] font-bold px-2 py-2 rounded-xl border transition-colors ${
                    household === h.id ? "bg-[#0B0D12] text-white border-[#0B0D12]" : "bg-white text-[#6B7280] border-[#D8E0ED]"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#0B0D12] mb-2">What are you interested in?</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setInterests((prev) => toggle(prev, category));
                  setSaved(false);
                }}
                className={chip(interests.includes(category))}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          className="w-full bg-[#0B0D12] text-white py-3 rounded-full font-bold text-sm hover:bg-[#1A1F2C] transition-colors"
        >
          {saved ? "Profile saved ✓" : "Save profile"}
        </button>
        <p className="text-[11px] text-[#6B7280] text-center -mt-2">
          Fires <span className="font-semibold">Inform Affinity</span> (categories, goals, personas) and a{" "}
          <span className="font-semibold">Financial Profile Updated</span> event
        </p>
      </div>

      {/* Settings */}
      <div className="bg-[#F6F7FB] rounded-2xl border border-[#D8E0ED] divide-y divide-[#D8E0ED]">
        {SETTINGS.map((item) => (
          <button
            key={item}
            className="w-full flex justify-between items-center px-4 py-3.5 text-sm font-semibold text-[#0B0D12] hover:bg-[#E7EEFF] transition-colors"
          >
            {item}
            <span className="text-[#6B7280]">›</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full border border-[#D14343]/30 text-[#D14343] py-3 rounded-full text-sm font-bold hover:bg-red-50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
