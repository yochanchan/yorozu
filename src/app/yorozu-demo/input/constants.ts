import { prefectures } from "@/lib/mockData/prefectures";

import {
  Plan1Document,
  SpecializedThemeDefinition,
  ThemeDefinition,
} from "./types";

export const THEME_LIMIT = 3;
export const INPUT_DEBOUNCE = 250;

const financeDocs: Plan1Document[] = [
  {
    id: "finance-statements",
    title: "決算書（直近2期）",
    description: "返済能力と資金繰り要因の把握に使用します",
  },
  {
    id: "finance-trial",
    title: "最新試算表（3か月以内）",
    description: "足元の損益・資金ギャップの確認に使用します",
  },
  {
    id: "finance-borrowings",
    title: "借入一覧（金融機関・残高・金利・返済条件）",
    description: "金利負担と借換余地の評価に使用します",
  },
  {
    id: "finance-ar",
    title: "売掛金・買掛金の合計額",
    description: "運転資金の過不足を概算するために使用します",
  },
];

const salesDocs: Plan1Document[] = [
  {
    id: "sales-trend",
    title: "売上推移（できれば月次1〜3年／なければ年次）",
    description: "成長性・季節性・変調の一次評価に用います",
  },
  {
    id: "sales-top-customers",
    title: "上位顧客5〜10社（業種・地域任意）",
    description: "顧客集中リスクの把握に用います",
  },
  {
    id: "sales-core-items",
    title: "主力商品・サービス一覧（粗利ざっくり）",
    description: "粗利構造の初期診断に用います",
  },
];

const profitDocs: Plan1Document[] = [
  {
    id: "profit-statements",
    title: "決算書（2〜3期）",
    description: "固定費・変動費のラフな内訳把握に用います",
  },
  {
    id: "profit-gross",
    title: "製品・サービス別の売上と原価（分かる範囲）",
    description: "粗利改善の当たり所を特定するために用います",
  },
  {
    id: "profit-suppliers",
    title: "大口仕入れ先一覧",
    description: "仕入条件や代替可能性の評価に用います",
  },
];

const peopleDocs: Plan1Document[] = [
  {
    id: "people-org-chart",
    title: "簡易組織図",
    description: "権限配分とボトルネック把握に用います",
  },
  {
    id: "people-headcount",
    title: "従業員数推移（3年）",
    description: "採用・離職の傾向把握に用います",
  },
  {
    id: "people-turnover",
    title: "離職状況（ざっくり）",
    description: "定着課題の初期把握に用います",
  },
  {
    id: "people-comp",
    title: "評価・給与ルールの概要",
    description: "動機づけと公正性の初期評価に用います",
  },
];

const itDocs: Plan1Document[] = [
  {
    id: "it-systems",
    title: "使用中システム一覧（会計・販売・在庫等）",
    description: "重複やブラックボックス化の確認に用います",
  },
  {
    id: "it-manual",
    title: "紙／Excelで手間がかかる業務（3つ）",
    description: "自動化の優先順位付けに用います",
  },
];

const globalDocs: Plan1Document[] = [
  {
    id: "global-plan",
    title: "海外展開・ECの現状と計画の概要",
    description: "販路拡大に向けた優先地域・商品を把握します",
  },
  {
    id: "global-logistics",
    title: "物流・輸出入体制の整理",
    description: "取引コストとリードタイムの改善余地を確認します",
  },
  {
    id: "global-partners",
    title: "海外パートナー／ECモールの一覧",
    description: "販路依存度とサポート体制を把握します",
  },
];

const successionDocs: Plan1Document[] = [
  {
    id: "succession-structure",
    title: "現経営者・後継者の関係整理",
    description: "承継のスケジュールと課題を俯瞰します",
  },
  {
    id: "succession-shares",
    title: "株式・持分の状況",
    description: "承継時の権利調整と税務課題を確認します",
  },
  {
    id: "succession-advisors",
    title: "関与専門家・関係金融機関",
    description: "連携先と役割分担の整理に用います",
  },
];

const newBusinessDocs: Plan1Document[] = [
  {
    id: "newbiz-outline",
    title: "新規事業のコンセプト概要",
    description: "想定顧客と価値提案を共有し、初期仮説を整えます",
  },
  {
    id: "newbiz-validation",
    title: "検証済みの仮説・ヒアリング結果",
    description: "追加検証や実証フェーズの設計に用います",
  },
  {
    id: "newbiz-resources",
    title: "投入予定の体制・リソース",
    description: "人員配置と投資計画の妥当性を確認します",
  },
];

const comprehensiveDocs: Plan1Document[] = [
  {
    id: "comprehensive-baseline",
    title: "全社の概要資料（会社案内等）",
    description: "Plan2の準備前に組織・事業全体像を把握します",
  },
  {
    id: "comprehensive-challenges",
    title: "直近の経営課題メモ",
    description: "優先度付けと論点整理のベースにします",
  },
];

export const themeDefinitions: ThemeDefinition[] = [
  { id: "finance", label: "資金繰り・借入", depth: "deep", plan1: financeDocs },
  { id: "sales", label: "売上・販路", depth: "shallow", plan1: salesDocs },
  { id: "profit", label: "利益改善・原価", depth: "deep", plan1: profitDocs },
  { id: "people", label: "人・組織", depth: "shallow", plan1: peopleDocs },
  { id: "itDx", label: "IT・DX", depth: "shallow", plan1: itDocs },
  { id: "global", label: "海外・EC", depth: "shallow", plan1: globalDocs },
  { id: "succession", label: "事業承継", depth: "deep", plan1: successionDocs },
  { id: "newBusiness", label: "新規事業", depth: "shallow", plan1: newBusinessDocs },
  { id: "comprehensive", label: "総合診断希望", depth: "shallow", plan1: comprehensiveDocs },
];

export const specializedThemes: SpecializedThemeDefinition[] = [
  {
    id: "successionMa",
    label: "事業承継・M&A",
    description: "後継者候補の整理やM&Aの初期的な検討内容を共有します",
    waitEstimate: "専門家調整：約2〜3週間",
  },
  {
    id: "globalExpansion",
    label: "海外・EC",
    description: "販路拡大や越境対応の準備資料を整えます",
    waitEstimate: "専門家調整：約2週間",
  },
  {
    id: "subsidy",
    label: "補助金",
    description: "対象事業・スケジュールの整理と必要資料を確認します",
    waitEstimate: "専門家調整：約1〜2週間",
  },
  {
    id: "itRefresh",
    label: "IT刷新",
    description: "現行システムと改善希望点の棚卸しを進めます",
    waitEstimate: "専門家調整：約1〜1.5週間",
  },
];

export const employeesRangeOptions = [
  { value: "0-10", label: "〜10名" },
  { value: "11-50", label: "11〜50名" },
  { value: "51-300", label: "51〜300名" },
  { value: "300+", label: "300名〜" },
];

export const revenueRangeOptions = [
  { value: "0-100M", label: "〜1億円" },
  { value: "100-500M", label: "1〜5億円" },
  { value: "500M-1B", label: "5〜10億円" },
  { value: "1B+", label: "10億円〜" },
];

export const timeHorizonOptions = [
  { value: "3m", label: "直近3か月" },
  { value: "1y", label: "1年以内" },
  { value: "3y", label: "中長期（3年）" },
];

export const urgencyOptions = [
  { value: "now", label: "今すぐ" },
  { value: "soon", label: "早めに" },
  { value: "research", label: "情報収集中" },
];

export const prefectureOptions = prefectures.map((pref) => ({
  value: pref.code,
  label: pref.name,
}));

export const plan2Documents = [
  "決算3期（PL/BS）",
  "売上構造",
  "事業別売上比率",
  "上位顧客割合",
  "簡易組織図",
  "経営者アンケート（10問）",
];

export const plan2SurveyPrompts = [
  "直近の経営課題を3点挙げてください",
  "資金繰りの見通し（3か月以内）",
  "販路開拓で活用したいチャネル",
  "注力したい顧客層",
  "粗利改善のために既に検討した施策",
  "採用・定着で困っている点",
  "DXで自動化したい業務",
  "海外展開の希望地域",
  "承継・M&Aで気になっていること",
  "その他伝えておきたい事項",
];

export const scoreDimensionLabels: Record<string, string> = {
  liquidity: "資金繰り危険度",
  margin: "粗利水準",
  concentration: "顧客依存度",
  organization: "組織の脆弱性",
  digital: "DXの遅れ",
};

export const headerMeta = {
  title: "よろず支援 相談インプット（デモ）",
  subtitle: "拠点：東京都よろず／担当：山田／日付：2025-11-12",
};
