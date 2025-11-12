export type ThemeId =
  | "finance"
  | "sales"
  | "profit"
  | "people"
  | "itDx"
  | "global"
  | "succession"
  | "newBusiness"
  | "comprehensive";

export type SpecializedThemeId =
  | "successionMa"
  | "globalExpansion"
  | "subsidy"
  | "itRefresh";

export type DepthLevel = "shallow" | "deep";

export type Plan1Document = {
  id: string;
  title: string;
  description: string;
};

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  depth: DepthLevel;
  plan1: Plan1Document[];
};

export type SpecializedThemeDefinition = {
  id: SpecializedThemeId;
  label: string;
  description: string;
};

export type EmployeesRange = "0-10" | "11-50" | "51-300" | "300+" | "";
export type RevenueRange =
  | "0-100M"
  | "100-500M"
  | "500M-1B"
  | "1B+"
  | "";
export type TimeHorizon = "3m" | "1y" | "3y" | "";
export type Urgency = "now" | "soon" | "research" | "";

export type Plan0State = {
  companyName: string;
  prefecture: string;
  industrySelect: string | null;
  industryFree: string | null;
  employeesRange: EmployeesRange;
  revenueRange: RevenueRange;
  foundedYear: number | null;
  themes: ThemeId[];
  timeHorizon: TimeHorizon;
  urgency: Urgency;
  specializedThemes: SpecializedThemeId[];
};

export type ChecklistState = Partial<
  Record<ThemeId, Record<string, boolean>>
>;

export type ScoreTrend = "up" | "flat" | "down";
export type ScoreColor = "green" | "yellow" | "red";

export type Plan2ScoreHint = {
  id: string;
  label: string;
  color: ScoreColor;
  trend: ScoreTrend;
  rationale: string;
};

export type DerivedState = {
  showPlan1: ThemeId[];
  showPlan2: boolean;
  showPlan3Suggestion: boolean;
  showPlan4: boolean;
  showTeaser: boolean;
  isProvisionalFinal: boolean;
  scoreHints: Plan2ScoreHint[];
};

export type ValidationErrors = Partial<Record<keyof Plan0State | "industryGroup", string>> & {
  themes?: string;
};
