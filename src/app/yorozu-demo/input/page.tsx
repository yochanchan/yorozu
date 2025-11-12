"use client";

import { useEffect, useState } from "react";

import { headerMeta } from "./constants";
import { DynamicPanel } from "./components/DynamicPanel";
import { Plan0Form } from "./components/Plan0Form";
import { useConsultationPlanner } from "./hooks";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const InputDemoPage = () => {
  const {
    draft,
    plan0,
    derived,
    checklist,
    errors,
    snackbar,
    liveMessage,
    industries,
    updateCompanyName,
    updatePrefecture,
    updateIndustrySelect,
    updateIndustryFree,
    updateEmployeesRange,
    updateRevenueRange,
    updateFoundedYear,
    updateTimeHorizon,
    updateUrgency,
    toggleTheme,
    toggleSpecializedTheme,
    toggleChecklistItem,
    isThemeDisabled,
    resetAll,
    closeSnackbar,
    notifyThemeLimit,
  } = useConsultationPlanner();

  const isMobile = useIsMobile();
  const [plan0Open, setPlan0Open] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isMobile) {
        setPlan0Open(true);
        setPanelOpen(true);
      } else {
        setPlan0Open(true);
        setPanelOpen(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isMobile]);

  return (
    <div className="space-y-8">
      <section className="yorozu-card space-y-3 rounded-2xl border px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          相談インプット（デモ）
        </p>
        <h1 className="text-3xl font-bold text-slate-900">{headerMeta.title}</h1>
        <p className="text-sm text-slate-500">{headerMeta.subtitle}</p>
        <p className="text-sm text-slate-600">
          この画面は、よろず支援拠点の相談受付時にPlan0のヒアリング内容を記録し、Plan1〜4およびご提案の内容を即時にプレビューするためのデモです。入力内容は保存されません。
        </p>
      </section>

      {!isMobile ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,48%)_minmax(0,52%)]">
          <Plan0Form
            draft={draft}
            industries={industries}
            errors={errors}
            onCompanyNameChange={updateCompanyName}
            onPrefectureChange={updatePrefecture}
            onIndustrySelectChange={updateIndustrySelect}
            onIndustryFreeChange={updateIndustryFree}
            onEmployeesRangeChange={updateEmployeesRange}
            onRevenueRangeChange={updateRevenueRange}
            onFoundedYearChange={updateFoundedYear}
            onTimeHorizonChange={updateTimeHorizon}
            onUrgencyChange={updateUrgency}
            onToggleTheme={toggleTheme}
            onToggleSpecializedTheme={toggleSpecializedTheme}
            isThemeDisabled={isThemeDisabled}
            notifyThemeLimit={notifyThemeLimit}
          />
          <DynamicPanel
            derived={derived}
            plan0={plan0}
            checklist={checklist}
            onToggleChecklistItem={toggleChecklistItem}
            liveMessage={liveMessage}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-700"
              onClick={() => setPlan0Open((prev) => !prev)}
              aria-expanded={plan0Open}
            >
              <span>Plan0（共通インプット）</span>
              <span aria-hidden="true">{plan0Open ? "−" : "＋"}</span>
            </button>
            {plan0Open && (
              <div className="border-t border-slate-200 px-4 pb-5">
                <Plan0Form
                  draft={draft}
                  industries={industries}
                  errors={errors}
                  onCompanyNameChange={updateCompanyName}
                  onPrefectureChange={updatePrefecture}
                  onIndustrySelectChange={updateIndustrySelect}
                  onIndustryFreeChange={updateIndustryFree}
                  onEmployeesRangeChange={updateEmployeesRange}
                  onRevenueRangeChange={updateRevenueRange}
                  onFoundedYearChange={updateFoundedYear}
                  onTimeHorizonChange={updateTimeHorizon}
                  onUrgencyChange={updateUrgency}
                  onToggleTheme={toggleTheme}
                  onToggleSpecializedTheme={toggleSpecializedTheme}
                  isThemeDisabled={isThemeDisabled}
                  notifyThemeLimit={notifyThemeLimit}
                />
              </div>
            )}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-700"
              onClick={() => setPanelOpen((prev) => !prev)}
              aria-expanded={panelOpen}
            >
              <span>Plan1〜4・ご提案プレビュー</span>
              <span aria-hidden="true">{panelOpen ? "−" : "＋"}</span>
            </button>
            {panelOpen && (
              <div className="border-t border-slate-200 px-4 pb-5">
                <DynamicPanel
                  derived={derived}
                  plan0={plan0}
                  checklist={checklist}
                  onToggleChecklistItem={toggleChecklistItem}
                  liveMessage={liveMessage}
                />
              </div>
            )}
          </section>
        </div>
      )}

      <footer className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <span>入力内容を確認のうえ、右側のチェックリストをご活用ください。</span>
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          入力をリセット
        </button>
      </footer>

      {snackbar && (
        <div className="fixed inset-x-4 bottom-6 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-slate-900 px-4 py-3 text-sm text-white shadow-lg sm:inset-x-auto sm:right-6">
          <span>{snackbar}</span>
          <button
            type="button"
            onClick={closeSnackbar}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
};

export default InputDemoPage;
