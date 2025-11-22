"use client";

import { useCallback } from "react";

import { HeroSection } from "@/app/ksuns/components/HeroSection";
import { CategoryGrid } from "@/app/ksuns/components/CategoryGrid";
import { SubcategorySelector } from "@/app/ksuns/components/SubcategorySelector";
import { PlannerForm } from "@/app/ksuns/components/PlannerForm";
import { ResultPanel } from "@/app/ksuns/components/ResultPanel";
import {
  KsunsPlannerProvider,
  useKsunsPlanner,
} from "@/app/ksuns/context/KsunsPlannerContext";

const projectGoals = [
  {
    title: "仮コンセプト生成",
    detail:
      "ジャンルと条件を送信すると AI がキャッチコピー・ターゲット像をまとめます。",
  },
  {
    title: "基本 KPI",
    detail: "客数・客単価・回転率・売上を概算し意思決定の起点を提示します。",
  },
  {
    title: "メニュー例＆戦略",
    detail: "メニューサンプルと集客/オペレーション戦略で具体的な像を描きます。",
  },
  {
    title: "収支予測と投資目安",
    detail: "初期投資、運転資金、損益分岐を算出し資金計画に活かします。",
  },
  {
    title: "登録導線",
    detail: "仮シミュレーションから詳細シミュレーション（登録後）へ誘導します。",
  },
];

const KsunsPageContent = () => {
  const { mainCategory, subCategory, selectMainCategory, selectSubCategory } =
    useKsunsPlanner();

  const handleStart = useCallback(() => {
    document
      .getElementById("ksuns-main-category")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <HeroSection onStart={handleStart} />

        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            PROJECT GOALS
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projectGoals.map((goal) => (
              <div
                key={goal.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {goal.title}
                </p>
                <p className="text-sm text-slate-600">{goal.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <CategoryGrid
          selected={mainCategory}
          onSelect={selectMainCategory}
        />
        <SubcategorySelector
          mainCategory={mainCategory}
          selected={subCategory}
          onSelect={selectSubCategory}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PlannerForm />
          <ResultPanel />
        </div>
      </div>
    </div>
  );
};

const KsunsPage = () => (
  <KsunsPlannerProvider>
    <KsunsPageContent />
  </KsunsPlannerProvider>
);

export default KsunsPage;
