export type ConsultationCategory =
  | "事業承継"
  | "創業"
  | "販路開拓"
  | "資金繰り"
  | "IT知識全般"
  | "その他";

export type Prefecture = {
  code: string;
  name: string;
  region:
    | "北海道・東北"
    | "関東"
    | "中部"
    | "近畿"
    | "中国・四国"
    | "九州";
};

export type YearlySummary = {
  year: number;
  level: "national" | "pref";
  prefCode?: string;
  consultations: number;
  solvedCount: number;
  transferCount: number;
  coordinatorCount?: number;
  categoryShare: Partial<Record<ConsultationCategory, number>>;
};

export type MonthlyTrend = {
  year: number;
  prefCode: string; // use "ALL" for nationwide data
  months: {
    month: number; // 4-3 (fiscal year)
    consultations: number;
    solved: number;
    transfer: number;
  }[];
};

export type CaseStatus = "相談受付中" | "継続支援中" | "解決" | "取次中";

export type Case = {
  id: string;
  prefCode: string;
  date: string;
  clientProfile: {
    industry: string;
    employees: string;
    sales: string;
    yearsInBusiness: string;
  };
  categories: ConsultationCategory[];
  summary: string;
  supportPlan: string;
  status: CaseStatus;
  coordinator: string;
  transfer: {
    hasTransfer: boolean;
    type: "他拠点" | "全国本部" | "他支援機関" | null;
    target: string | null;
  };
};

export type SuccessStory = {
  id: string;
  title: string;
  prefCode: string;
  categories: ConsultationCategory[];
  industry: string;
  summary: string;
  keySupport: string[];
  outcome: string;
  tags: string[];
};

export type RecommendationRule = {
  id: string;
  match: {
    categories?: ConsultationCategory[];
    industry?: string;
    prefCode?: string;
  };
  suggestStoryIds: string[];
  label: string;
};

export type PrefectureRealtimeStat = {
  todayConsultations: number;
  monthConsultations: number;
};

export type DemoCounters = {
  consultations: Record<string, number>;
  transfers: Record<string, number>;
};
