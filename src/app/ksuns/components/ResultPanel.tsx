"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useKsunsPlanner } from "@/app/ksuns/context/KsunsPlannerContext";
import {
  hasFormErrors,
  validateKsunsForm,
} from "@/app/ksuns/utils/validation";
import { formatNumber } from "@/lib/utils/formatNumber";

export const ResultPanel = () => {
  const {
    mainCategory,
    subCategory,
    form,
    result,
    isLoading,
    generateSimulation,
  } = useKsunsPlanner();

  const errors = useMemo(() => validateKsunsForm(form), [form]);
  const isDisabled =
    !mainCategory || !subCategory || hasFormErrors(errors) || isLoading;

  const handleGenerate = () => {
    if (isDisabled) return;
    generateSimulation();
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          ⑤ RESULT
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          簡易シミュレーション結果
        </h2>
        <p className="text-sm text-slate-600">
          ②〜④ の入力内容を AI API に送信し、仮コンセプトと KPI を生成します（今回はモックデータで即時応答）。
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
        <span className="rounded-full bg-blue-50 px-3 py-1">
          メイン: {mainCategory ?? "未選択"}
        </span>
        <span className="rounded-full bg-blue-50 px-3 py-1">
          サブ: {subCategory ?? "未選択"}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1">
          座席数: {form.seats || "未入力"}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1">
          客単価: {form.unitPrice || "未入力"}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          枠数: {form.timeSlots.length}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-500">
        <p>
          {mainCategory && subCategory
            ? "条件がそろいました。AI へ送信して仮コンセプトを取得しましょう。"
            : "メイン・サブカテゴリを選択すると送信ボタンが有効になります。"}
        </p>
        {hasFormErrors(errors) && (
          <p className="mt-1 text-red-600">
            入力エラーを解消すると送信できるようになります。
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "AI に送信中..." : "AI に送信して仮コンセプトを生成"}
        </button>
        <span className="text-xs text-slate-500">
          通信は擬似的に 0.8 秒かかります。完成版では API Gateway へ POST 予定です。
        </span>
      </div>

      {result ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              仮コンセプト
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {result.concept.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{result.concept.summary}</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              ターゲット像: {result.concept.target}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-blue-700">
              {result.concept.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-blue-50 px-3 py-1 font-semibold"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">基本 KPI</p>
              <div className="mt-3 grid gap-3">
                {result.kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                  >
                    <p className="text-xs text-slate-500">{kpi.label}</p>
                    <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                    {kpi.description && (
                      <p className="text-xs text-slate-500">{kpi.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">
                メニュー例・提供イメージ
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {result.menuExamples.map((menu) => (
                  <li
                    key={menu.name}
                    className="rounded-xl border border-dashed border-slate-200 px-3 py-2"
                  >
                    <p className="font-semibold text-slate-900">{menu.name}</p>
                    <p>{menu.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">
                集客戦略（マーケティング）
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {result.marketing.map((strategy) => (
                  <li key={strategy.title} className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-900">{strategy.title}</p>
                    <p>{strategy.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">
                オペレーション戦略
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {result.operations.map((strategy) => (
                  <li key={strategy.title} className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-900">{strategy.title}</p>
                    <p>{strategy.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white px-4 py-5">
            <p className="text-sm font-semibold text-slate-700">
              収支予測と投資目安
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                <p>
                  初期費用:{" "}
                  <span className="font-semibold text-slate-900">
                    ¥{formatNumber(result.finance.initialCost)}
                  </span>
                </p>
                <p>
                  運転資金:{" "}
                  <span className="font-semibold text-slate-900">
                    ¥{formatNumber(result.finance.workingCapital)}
                  </span>
                </p>
                <p>
                  月次売上:{" "}
                  <span className="font-semibold text-slate-900">
                    ¥{formatNumber(result.finance.monthlyRevenue)}
                  </span>
                </p>
                <p>
                  月次利益:{" "}
                  <span className="font-semibold text-emerald-700">
                    ¥{formatNumber(result.finance.monthlyProfit)}
                  </span>
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                <p>
                  月次コスト: ¥{formatNumber(result.finance.monthlyCost)}
                </p>
                <p>損益分岐: {result.finance.breakEvenMonths} か月目</p>
                <p className="mt-2 text-slate-500">{result.finance.fundingTips}</p>
                <Link
                  href="/yorozu-demo/stories"
                  className="mt-3 inline-flex items-center text-xs font-semibold text-blue-700 underline-offset-2 hover:underline"
                >
                  資金調達の成功事例を確認する
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              ユーザー登録を促す
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {result.cta.title}
            </h3>
            <p className="mt-2 text-sm text-slate-700">{result.cta.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={result.cta.actionHref}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {result.cta.actionLabel}
              </Link>
              <span className="text-xs text-slate-500">
                登録なしでも結果は閲覧可能。詳細シミュレーションにはログインが必要です。
              </span>
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
          条件を入力して「AI に送信」を押すと、ここに仮コンセプト結果が表示されます。
          駅チカ・観光地など立地の違いによって KPI がどう変化するかを比較することもできます。
        </div>
      )}
    </section>
  );
};
