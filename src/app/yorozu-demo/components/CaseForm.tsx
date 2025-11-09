"use client";

import { consultationCategories } from "@/lib/mockData/categories";
import { industries } from "@/lib/mockData/industries";
import { CaseStatus, ConsultationCategory } from "@/lib/types";

export type CaseDraft = {
  id: string;
  date: string;
  industry: string;
  employees: string;
  sales: string;
  yearsInBusiness: string;
  categories: ConsultationCategory[];
  summary: string;
  supportPlan: string;
  status: CaseStatus;
  coordinator: string;
};

const employeeRanges = ["1-4", "5-9", "10-49", "50-299", "300+"];
const salesRanges = [
  "〜5,000万円",
  "5,000万〜1億円",
  "1〜5億円",
  "5〜10億円",
  "10億円〜",
];
const yearsRanges = ["1年未満", "1-3年", "3-5年", "5-10年", "10年以上"];
const coordinators = [
  "田中コーディネーター",
  "山本コーディネーター",
  "吉田コーディネーター",
  "村上コーディネーター",
];

type CaseFormProps = {
  draft: CaseDraft;
  onDraftChange: (draft: CaseDraft) => void;
  onSubmit: () => void;
  onTransfer: () => void;
  selectedPrefName: string;
  feedback?: string | null;
};

export const CaseForm = ({
  draft,
  onDraftChange,
  onSubmit,
  onTransfer,
  selectedPrefName,
  feedback,
}: CaseFormProps) => {
  const updateField = (field: keyof CaseDraft, value: string) => {
    onDraftChange({ ...draft, [field]: value });
  };

  const toggleCategory = (category: ConsultationCategory) => {
    const exists = draft.categories.includes(category);
    const categories = exists
      ? draft.categories.filter((cat) => cat !== category)
      : [...draft.categories, category];
    onDraftChange({ ...draft, categories });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="yorozu-card flex flex-col gap-6 rounded-2xl border px-6 py-6"
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          相談カルテ
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          {selectedPrefName} よろず支援拠点
        </h2>
        <p className="text-sm text-slate-500">
          相談内容を登録すると全国ダッシュボードにも即時反映されます（デモ）
        </p>
        {feedback && (
          <div className="mt-3 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
            {feedback}
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          相談ID
          <div className="mt-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 font-mono text-base text-slate-900">
            {draft.id}
          </div>
        </label>
        <label className="text-sm font-medium text-slate-600">
          相談日
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={draft.date}
            onChange={(event) => updateField("date", event.target.value)}
          />
        </label>
      </div>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">事業者情報</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-600">
            業種
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={draft.industry}
              onChange={(event) => updateField("industry", event.target.value)}
            >
              <option value="">選択してください</option>
              {industries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            従業員数レンジ
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={draft.employees}
              onChange={(event) => updateField("employees", event.target.value)}
            >
              <option value="">選択してください</option>
              {employeeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}人
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            売上規模レンジ
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={draft.sales}
              onChange={(event) => updateField("sales", event.target.value)}
            >
              <option value="">選択してください</option>
              {salesRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            創業年数レンジ
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={draft.yearsInBusiness}
              onChange={(event) =>
                updateField("yearsInBusiness", event.target.value)
              }
            >
              <option value="">選択してください</option>
              {yearsRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            相談類型（複数選択）
          </h3>
          <span className="text-xs text-slate-500">必須</span>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {consultationCategories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-slate-700"
            >
              <input
                type="checkbox"
                checked={draft.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <label className="text-sm font-medium text-slate-600">
          相談概要
          <textarea
            rows={4}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="例：EC導入と在庫管理の連携について相談したい。"
            value={draft.summary}
            onChange={(event) => updateField("summary", event.target.value)}
          />
          <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span role="img" aria-label="マイク">
              🎙
            </span>
            音声入力にも対応可能な設計（本デモではイメージ表示のみ）
          </span>
        </label>
        <label className="text-sm font-medium text-slate-600">
          支援内容
          <textarea
            rows={4}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="提案内容や支援方針を記入してください。"
            value={draft.supportPlan}
            onChange={(event) =>
              updateField("supportPlan", event.target.value)
            }
          />
        </label>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium text-slate-600">
          担当コーディネーター
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={draft.coordinator}
            onChange={(event) => updateField("coordinator", event.target.value)}
          >
            {coordinators.map((coordinator) => (
              <option key={coordinator} value={coordinator}>
                {coordinator}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-600">
          ステータス
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={draft.status}
            onChange={(event) =>
              updateField("status", event.target.value as CaseStatus)
            }
          >
            <option value="相談受付中">相談受付中</option>
            <option value="継続支援中">継続支援中</option>
            <option value="解決">解決</option>
            <option value="取次中">取次中</option>
          </select>
        </label>
      </section>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <button
          type="button"
          onClick={onTransfer}
          className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
        >
          他拠点・本部・他支援機関連携（取次）
        </button>
        <button
          type="submit"
          className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          相談内容を登録（デモ）
        </button>
      </div>
    </form>
  );
};
