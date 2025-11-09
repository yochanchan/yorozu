"use client";

import { useMemo, useState } from "react";

import { CaseForm, CaseDraft } from "@/app/yorozu-demo/components/CaseForm";
import { PrefectureSelector } from "@/app/yorozu-demo/components/PrefectureSelector";
import { RecommendationPanel } from "@/app/yorozu-demo/components/RecommendationPanel";
import { SimplePieChart } from "@/app/yorozu-demo/components/charts/PieChart";
import { TransferModal } from "@/app/yorozu-demo/components/TransferModal";
import { useDemoState } from "@/app/yorozu-demo/context/DemoStateContext";
import { KpiCard } from "@/app/yorozu-demo/components/KpiCard";
import { prefectures } from "@/lib/mockData/prefectures";
import { getPrefYearlySummary } from "@/lib/mockData/yearlySummary";
import { formatPercent } from "@/lib/utils/formatNumber";

const year = 2025;

const generateCaseId = (prefCode: string) =>
  `CASE-${prefCode}-${year}-${Math.floor(Math.random() * 9000 + 1000)}`;

const BranchPage = () => {
  const [selectedPrefCode, setSelectedPrefCode] = useState("40");
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedPref =
    prefectures.find((pref) => pref.code === selectedPrefCode) ??
    prefectures[0];

  const [draft, setDraft] = useState<CaseDraft>({
    id: generateCaseId(selectedPrefCode),
    date: new Date().toISOString().split("T")[0],
    industry: "",
    employees: "",
    sales: "",
    yearsInBusiness: "",
    categories: ["販路開拓"],
    summary: "",
    supportPlan: "",
    status: "相談受付中",
    coordinator: "田中コーディネーター",
  });

  const {
    realtimePrefStats,
    registerConsultation,
    registerTransfer,
    getTransferDelta,
  } = useDemoState();

  const prefSummary = useMemo(
    () => getPrefYearlySummary(selectedPrefCode, year),
    [selectedPrefCode],
  );

  const categoryChartData = useMemo(
    () =>
      Object.entries(prefSummary.categoryShare).map(([name, value]) => ({
        name,
        value: Number(((value ?? 0) * 100).toFixed(1)),
      })),
    [prefSummary],
  );

  const handlePrefChange = (code: string) => {
    setSelectedPrefCode(code);
    setDraft((prev) => ({
      ...prev,
      id: generateCaseId(code),
      categories: prev.categories.length ? prev.categories : ["販路開拓"],
    }));
  };

  const handleRegister = () => {
    registerConsultation(selectedPrefCode);
    setFeedback("相談内容を登録しました（ダッシュボードにも即時反映します）");
    setTimeout(() => setFeedback(null), 4000);
    setDraft((prev) => ({
      ...prev,
      id: generateCaseId(selectedPrefCode),
      summary: "",
      supportPlan: "",
    }));
  };

  const handleTransfer = () => setIsTransferOpen(true);

  const handleTransferSubmit = () => {
    registerTransfer(selectedPrefCode);
    setIsTransferOpen(false);
    setDraft((prev) => ({ ...prev, status: "取次中" }));
    setFeedback("取次依頼を送信しました（ダッシュボードの取次件数を加算）");
    setTimeout(() => setFeedback(null), 4000);
  };

  const prefRealtime = realtimePrefStats[selectedPrefCode];

  const totalTransfers =
    prefSummary.transferCount + getTransferDelta(selectedPrefCode);
  const solveRate = prefSummary.consultations
    ? prefSummary.solvedCount / prefSummary.consultations
    : 0;

  return (
    <div className="space-y-8" id="branch-root">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-start md:justify-between" id="branch-toolbar">
        <PrefectureSelector
          value={selectedPrefCode}
          onChange={handlePrefChange}
          label="拠点選択"
        />
        <div className="grid flex-1 gap-3 grid-cols-1 sm:grid-cols-2" id="branch-kpi-grid">
          <KpiCard
            label="本日相談件数"
            value={`${prefRealtime?.todayConsultations ?? 0}件`}
            description="デモ操作で即時加算"
          />
          <KpiCard
            label="今月相談件数"
            value={`${prefRealtime?.monthConsultations ?? 0}件`}
            description="リアルタイム風データ"
          />
          <KpiCard
            label="年間取次件数"
            value={`${totalTransfers}件`}
            description="取次操作で増加"
          />
          <KpiCard
            label="年間成果確認率"
            value={formatPercent(solveRate)}
            description="相談対応の成果"
          />
        </div>
        <div className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-inner md:max-w-xs lg:max-w-sm" id="branch-toolbar-chart">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              相談類型構成（{selectedPref.name}）
            </span>
            <span>{year}年度</span>
          </div>
          <div className="mt-2 h-50">
            <SimplePieChart data={categoryChartData} />
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" id="branch-content-grid">
        <CaseForm
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={handleRegister}
          onTransfer={handleTransfer}
          selectedPrefName={selectedPref.name}
          feedback={feedback}
        />
        <div className="space-y-6" id="branch-side-panel">
          <RecommendationPanel
            industry={draft.industry}
            categories={draft.categories}
          />
        </div>
      </div>

      <TransferModal
        open={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSubmit={handleTransferSubmit}
      />
    </div>
  );
};

export default BranchPage;
