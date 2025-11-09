"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { KpiCard } from "@/app/yorozu-demo/components/KpiCard";
import { SimpleLineChart } from "@/app/yorozu-demo/components/charts/LineChart";
import { SimpleBarChart } from "@/app/yorozu-demo/components/charts/BarChart";
import { useDemoState } from "@/app/yorozu-demo/context/DemoStateContext";
import { consultationCategories } from "@/lib/mockData/categories";
import { prefectures } from "@/lib/mockData/prefectures";
import {
  getNationalYearlySummary,
  getPrefYearlySummary,
} from "@/lib/mockData/yearlySummary";
import { getMonthlyTrend } from "@/lib/mockData/monthlyTrends";
import { formatNumber, formatPercent } from "@/lib/utils/formatNumber";
import { getTopCategories } from "@/lib/utils/calcKpi";

const years = [2024, 2025];
const categoryOptions = ["全体", ...consultationCategories] as const;
type CategoryFilter = (typeof categoryOptions)[number];

const isCategoryFilter = (
  value: CategoryFilter,
): value is (typeof consultationCategories)[number] => value !== "全体";

const HQDashboardPage = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("全体");
  const [sortKey, setSortKey] =
    useState<"consultations" | "solvedRate" | "transferCount">(
      "consultations",
    );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { getConsultationDelta, getTransferDelta } = useDemoState();

  const nationalSummary = getNationalYearlySummary(selectedYear);
  const adjustedNationalConsultations =
    nationalSummary.consultations + getConsultationDelta("ALL");
  const adjustedNationalTransfers =
    nationalSummary.transferCount + getTransferDelta("ALL");

  const prefRows = useMemo(() => {
    return prefectures.map((pref) => {
      const summary = getPrefYearlySummary(pref.code, selectedYear);
      const consultations =
        summary.consultations + getConsultationDelta(pref.code);
      const transferCount =
        summary.transferCount + getTransferDelta(pref.code);
      const solvedRate = summary.consultations
        ? summary.solvedCount / summary.consultations
        : 0;
      return {
        pref,
        consultations,
        transferCount,
        solvedRate,
        categoryShare: summary.categoryShare,
      };
    });
  }, [getConsultationDelta, getTransferDelta, selectedYear]);

  const filteredRows =
    categoryFilter === "全体"
      ? prefRows
      : prefRows.filter((row) => {
        if (!isCategoryFilter(categoryFilter)) {
          return true;
        }
        return (row.categoryShare[categoryFilter] ?? 0) > 0.16;
      });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const dir = sortDirection === "asc" ? 1 : -1;
    if (sortKey === "solvedRate") {
      return (a.solvedRate - b.solvedRate) * dir;
    }
    if (sortKey === "transferCount") {
      return (a.transferCount - b.transferCount) * dir;
    }
    return (a.consultations - b.consultations) * dir;
  });

  const chartData = (() => {
    const trend2024 = getMonthlyTrend("ALL", 2024);
    const trend2025 = getMonthlyTrend("ALL", 2025);
    if (!trend2024 || !trend2025) return [];
    return trend2025.months.map((month, index) => ({
      monthLabel: `${month.month}月`,
      FY2025: month.consultations,
      FY2024: trend2024.months[index]?.consultations ?? 0,
    }));
  })();

  const prefBarData = prefRows.map((row) => ({
    label: row.pref.name,
    consultations: row.consultations,
  }));

  const topCategories = getTopCategories(nationalSummary);

  const handleSort = (
    key: "consultations" | "solvedRate" | "transferCount",
  ) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm">
          年度：
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`mx-1 rounded-full px-3 py-1 text-sm ${selectedYear === year
                ? "bg-blue-600 text-white"
                : "text-slate-600"
                }`}
            >
              {year}
            </button>
          ))}
        </div>
        <select
          className="rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value as CategoryFilter)
          }
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              相談類型フィルタ: {option}
            </option>
          ))}
        </select>
        <Link
          href="/yorozu-demo/branch"
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
        >
          拠点画面へ戻る
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="全国 相談件数"
          value={`${formatNumber(adjustedNationalConsultations)}件`}
          description={`${selectedYear}年度`}
        />
        <KpiCard
          label="全国 成果確認率"
          value={formatPercent(
            nationalSummary.solvedCount / nationalSummary.consultations,
          )}
          description="相談カルテ登録済み案件ベース"
        />
        <KpiCard
          label="全国 取次件数"
          value={`${formatNumber(adjustedNationalTransfers)}件`}
          description="他拠点/本部/他機関連携"
        />
        <KpiCard
          label="主要相談類型"
          value={topCategories.map((cat) => cat.name).join(" / ")}
          description={topCategories
            .map((cat) => formatPercent(cat.value))
            .join(" / ")}
        />
      </div>

      <section className="yorozu-card rounded-2xl border px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            全国 月次推移（比較）
          </h2>
          <span className="text-xs text-slate-500">
            2024 vs 2025（年度ベース）
          </span>
        </div>
        <SimpleLineChart data={chartData} keys={["FY2024", "FY2025"]} />
      </section>
      <section className="yorozu-card rounded-2xl border px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            都道府県別 相談件数ランキング
          </h2>
          <span className="text-xs text-slate-500">
            {selectedYear}年度 上位12都道府県
          </span>
        </div>
        <SimpleBarChart
          data={prefBarData}
          labelKey="label"
          xTickAngle={-90}
          height={420}
        />
      </section>

      <section className="yorozu-card rounded-2xl border px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            47都道府県 比較
          </h2>
          <p className="text-xs text-slate-500">
            カラムヘッダーをクリックするとソートできます
          </p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 text-slate-700">都道府県</th>
                <th className="px-3 py-2">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort("consultations")}
                  >
                    相談件数
                  </button>
                </th>
                <th className="px-3 py-2">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort("solvedRate")}
                  >
                    成果確認率
                  </button>
                </th>
                <th className="px-3 py-2">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort("transferCount")}
                  >
                    取次件数
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr
                  key={row.pref.code}
                  className="cursor-pointer border-t border-slate-100 hover:bg-blue-50/50"
                  onClick={() =>
                    router.push(`/yorozu-demo/hq/pref/${row.pref.code}`)
                  }
                >
                  <td className="px-3 py-2 font-semibold text-slate-900">
                    {row.pref.name}
                  </td>
                  <td className="px-3 py-2">
                    {formatNumber(row.consultations)}件
                  </td>
                  <td className="px-3 py-2">
                    {formatPercent(row.solvedRate)}
                  </td>
                  <td className="px-3 py-2">
                    {formatNumber(row.transferCount)}件
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default HQDashboardPage;
