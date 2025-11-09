import { Case } from "@/lib/types";

export const pastCases: Case[] = [
  {
    id: "FUKUOKA-2025-0011",
    prefCode: "40",
    date: "2025-04-03",
    clientProfile: {
      industry: "食品製造",
      employees: "10-49",
      sales: "1-5億円",
      yearsInBusiness: "10年以上",
    },
    categories: ["販路開拓", "IT知識全般"],
    summary:
      "自社EC刷新とSNS広告を同時に進めたいが社内リソースが不足。段階的な改善プランを相談。",
    supportPlan:
      "在庫管理とEC連携の要件化、撮影パートナーの紹介、広告代理店との伴走ミーティングを月2回実施。",
    status: "継続支援中",
    coordinator: "田中コーディネーター",
    transfer: {
      hasTransfer: true,
      type: "他支援機関",
      target: "福岡県よろずITメンター",
    },
  },
];

export const getCaseById = (caseId: string) =>
  pastCases.find((c) => c.id === caseId);
