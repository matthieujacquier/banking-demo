import { NextRequest, NextResponse } from "next/server";
import { proxyToDY } from "@/lib/dy-proxy";
import { DY_CRM_FEED_KEY } from "@/lib/dy-config";

// Pin to US East — DY's US datacenter geo-blocks EU-edge requests with 451.
export const preferredRegion = "iad1";

const E164 = /^\+[1-9]\d{7,14}$/;

// The demo CRM row every new customer gets: a risk-seeking Premium customer
// (Customer Tier = Premium, Risk Appetite 8), so they fall into that audience.
// DY expects every attribute in each call, hence the full row. Dropdown fields
// take the schema's numeric values.
const RISK_SEEKING_PREMIUM = {
  CustomerTier: 2, // Premium
  LifeStage: 1, // young_professional
  RiskAppetite: 8,
  FinancialGoals: [1, 7, 8], // invest, travel, home
  HeldCategories: [0, 1, 3], // Accounts, Cards, Savings
  HeldProductSkus: ["CARD-NOM-001", "SAV-INST-001"],
  BalanceBand: 2, // €10k – €50k
  MonthlyCardSpend: 1850.5,
  CreditScoreBand: 3, // Very good
  PreApprovedLoanAmount: 25000,
  CustomerSince: "2019-03-14T09:00:00Z",
  MortgageRenewalDate: "2027-02-01T00:00:00Z",
  ChurnRisk: 0, // Low
  IsAppActive: true,
  HasAdvisor: false,
  LastProductOpenedSku: "CARD-NOM-001",
};

export async function POST(req: NextRequest) {
  const { phone } = (await req.json().catch(() => ({}))) as { phone?: unknown };
  if (typeof phone !== "string" || !E164.test(phone)) {
    return NextResponse.json({ error: "phone must be E.164, e.g. +32470123456" }, { status: 400 });
  }
  return proxyToDY(`/userdata/${DY_CRM_FEED_KEY}/bulk`, {
    requests: [
      {
        action: "upsert",
        cuid: phone,
        cuidtype: "phoneNumber",
        timestamp: new Date().toISOString(),
        data: RISK_SEEKING_PREMIUM,
      },
    ],
  });
}
