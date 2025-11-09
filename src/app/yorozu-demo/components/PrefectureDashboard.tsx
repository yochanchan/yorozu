"use client";

import { SimpleBarChart } from "@/app/yorozu-demo/components/charts/BarChart";
import { SimplePieChart } from "@/app/yorozu-demo/components/charts/PieChart";
import { KpiCard } from "@/app/yorozu-demo/components/KpiCard";
import { SuccessStoryCard } from "@/app/yorozu-demo/components/SuccessStoryCard";
import { useDemoState } from "@/app/yorozu-demo/context/DemoStateContext";
import { MonthlyTrend, SuccessStory, YearlySummary } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/utils/formatNumber";

type PrefectureDashboardProps = {
  prefCode: string;
  prefName: string;
  summary: YearlySummary;
  monthlyTrend: MonthlyTrend;
  stories: SuccessStory[];
};

export const PrefectureDashboard = ({
  prefCode,
  prefName,
  summary,
  monthlyTrend,
  stories,
}: PrefectureDashboardProps) => {
  const { getConsultationDelta, getTransferDelta } = useDemoState();

  const adjustedConsultations =
    summary.consultations + getConsultationDelta(prefCode);
  const adjustedTransfers =
    summary.transferCount + getTransferDelta(prefCode);

  const pieData = Object.entries(summary.categoryShare).map(
    ([name, value]) => ({
      name,
      value: Number(((value ?? 0) * 100).toFixed(1)),
    }),
  );

  const barData = monthlyTrend.months.map((month) => ({
    monthLabel: `${month.month}月`,
    consultations: month.consultations,
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="年度相談件数"
          value={`${formatNumber(adjustedConsultations)}件`}
        />
        <KpiCard
          label="成果確認率"
          value={formatPercent(summary.solvedCount / summary.consultations)}
        />
        <KpiCard
          label="取次件数"
          value={`${formatNumber(adjustedTransfers)}件`}
        />
        <KpiCard
          label="コーディネーター数"
          value={`${summary.coordinatorCount ?? 0}名`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="yorozu-card rounded-2xl border px-6 py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              相談類型構成
            </h3>
            <span className="text-xs text-slate-500">{prefName}</span>
          </div>
          <SimplePieChart data={pieData} />
        </section>
        <section className="yorozu-card rounded-2xl border px-6 py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              月別相談件数
            </h3>
            <span className="text-xs text-slate-500">年度ベース</span>
          </div>
          <SimpleBarChart data={barData} />
        </section>
      </div>

      <section className="yorozu-card space-y-4 rounded-2xl border px-6 py-6">
        <h3 className="text-lg font-semibold text-slate-900">
          成功事例（抜粋）
        </h3>
        {stories.length > 0 ? (
          stories.map((story) => <SuccessStoryCard key={story.id} story={story} />)
        ) : (
          <p className="text-sm text-slate-500">
            現時点で紐づく成功事例はありません。
          </p>
        )}
      </section>
    </div>
  );
};
