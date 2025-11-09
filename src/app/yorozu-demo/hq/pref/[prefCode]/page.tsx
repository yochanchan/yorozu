import Link from "next/link";
import { notFound } from "next/navigation";

import { PrefectureDashboard } from "@/app/yorozu-demo/components/PrefectureDashboard";
import { prefectures } from "@/lib/mockData/prefectures";
import { successStories } from "@/lib/mockData/successStories";
import { getMonthlyTrend } from "@/lib/mockData/monthlyTrends";
import { getPrefYearlySummary } from "@/lib/mockData/yearlySummary";

type PrefPageProps = {
  params: { prefCode: string };
};

const PrefecturePage = ({ params }: PrefPageProps) => {
  const pref = prefectures.find((p) => p.code === params.prefCode);
  if (!pref) {
    notFound();
  }

  const summary = getPrefYearlySummary(pref.code, 2025);
  const monthlyTrend =
    getMonthlyTrend(pref.code, 2025) ?? getMonthlyTrend("ALL", 2025);
  if (!monthlyTrend) {
    notFound();
  }

  const stories = successStories.filter((story) => story.prefCode === pref.code);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
            都道府県詳細
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {pref.name} よろず支援拠点 詳細（デモ）
          </h1>
        </div>
        <Link
          href="/yorozu-demo/hq"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          全国ダッシュボードへ戻る
        </Link>
      </div>
      <PrefectureDashboard
        prefCode={pref.code}
        prefName={pref.name}
        summary={summary}
        monthlyTrend={monthlyTrend}
        stories={stories}
      />
    </div>
  );
};

export default PrefecturePage;
