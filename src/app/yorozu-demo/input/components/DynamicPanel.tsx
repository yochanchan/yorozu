"use client";

import { useMemo, useState } from "react";

import {
  plan2Documents,
  plan2SurveyPrompts,
  specializedThemes,
  themeDefinitions,
} from "../constants";
import { FadeTransition } from "./FadeTransition";
import { Modal } from "./Modal";
import {
  ChecklistState,
  DerivedState,
  Plan0State,
  Plan2ScoreHint,
  ThemeId,
} from "../types";

type DynamicPanelProps = {
  derived: DerivedState;
  plan0: Plan0State;
  checklist: ChecklistState;
  onToggleChecklistItem: (themeId: ThemeId, docId: string) => void;
  liveMessage: string;
};

const statusLabel = (done: boolean) => (done ? "提出済" : "未提出");

const scoreColors: Record<Plan2ScoreHint["color"], string> = {
  green: "bg-green-50 text-green-700 border-green-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
};

const trendSymbol: Record<Plan2ScoreHint["trend"], string> = {
  up: "▲",
  flat: "→",
  down: "▼",
};

const trendLabel: Record<Plan2ScoreHint["trend"], string> = {
  up: "上昇傾向",
  flat: "横ばい",
  down: "低下傾向",
};

const plan3Summary = (state: Plan0State) => {
  const themes = state.themes
    .map((themeId) => themeDefinitions.find((theme) => theme.id === themeId)?.label)
    .filter(Boolean)
    .join("、");
  if (!themes) {
    return "重点テーマが選択されると、論点を深掘りする高度診断をご案内します。";
  }
  if (state.urgency === "now") {
    return `緊急度が高いため、「${themes}」を中心に初回面談で論点整理し、必要に応じてPlan3の同意事項をご確認いただきます。`;
  }
  return `選択されたテーマ（${themes}）について、追加検討が必要な場合はPlan3で専門家チームをご案内します。`;
};

const Plan1Cards = ({
  derived,
  checklist,
  onToggle,
}: {
  derived: DerivedState;
  checklist: ChecklistState;
  onToggle: (themeId: ThemeId, docId: string) => void;
}) => {
  if (derived.showPlan1.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        右側に、必要資料のチェックリストやご提案が表示されます。まずは相談テーマを 1〜3 件お選びください。
      </div>
    );
  }

  const activeSet = new Set(derived.showPlan1);
  return (
    <div className="space-y-4">
      {themeDefinitions.map((theme) => {
        const show = activeSet.has(theme.id);
        const docs = theme.plan1;
        const themeChecklist = checklist[theme.id] ?? {};
        const submitted = Object.values(themeChecklist).filter(Boolean).length;
        return (
          <FadeTransition key={theme.id} show={show}>
            <article className="yorozu-card space-y-4 rounded-2xl border px-5 py-5">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{theme.label}</h3>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    必要資料チェックリスト
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {submitted === docs.length ? "全項目 提出済" : `${submitted} / ${docs.length}`}
                </span>
              </header>
              <ul className="space-y-3">
                {docs.map((doc) => {
                  const done = Boolean(themeChecklist[doc.id]);
                  return (
                    <li
                      key={doc.id}
                      className="flex flex-col gap-2 rounded-xl border border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{doc.title}</p>
                        <p className="text-xs text-slate-500">{doc.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggle(theme.id, doc.id)}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
                          done
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                        aria-pressed={done}
                      >
                        <span className="inline-block size-2 rounded-full bg-current" aria-hidden="true" />
                        {statusLabel(done)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
          </FadeTransition>
        );
      })}
    </div>
  );
};

const Plan2Card = ({ derived }: { derived: DerivedState }) => (
  <FadeTransition show={derived.showPlan2}>
    <section className="yorozu-card space-y-5 rounded-2xl border px-5 py-5">
      <header>
        <h3 className="text-lg font-semibold text-slate-900">総合ライト診断（Plan2）</h3>
        <p className="text-sm text-slate-600">
          「総合診断希望」の選択に応じて、全社の現状を短時間で把握する資料セットをご案内します。
        </p>
      </header>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          提出物（ダミー）
        </p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {plan2Documents.map((doc) => (
            <li key={doc} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
              {doc}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          簡易スコア（色＋矢印）
        </p>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {derived.scoreHints.map((hint) => (
            <div
              key={hint.id}
              className={`rounded-xl border px-3 py-3 text-sm font-medium ${scoreColors[hint.color]}`}
            >
              <div className="flex items-center justify-between">
                <span>{hint.label}</span>
                <span aria-hidden="true">{trendSymbol[hint.trend]}</span>
              </div>
              <p className="mt-1 text-xs font-normal text-slate-600">
                {hint.rationale}
              </p>
              <span className="sr-only">{trendLabel[hint.trend]}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          アンケート（参考表示）
        </p>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {plan2SurveyPrompts.map((prompt, index) => (
            <li key={prompt}>
              {index + 1}. {prompt}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </FadeTransition>
);

const Plan3Card = ({ derived, plan0 }: { derived: DerivedState; plan0: Plan0State }) => (
  <FadeTransition show={derived.showPlan3Suggestion}>
    <section className="yorozu-card space-y-3 rounded-2xl border px-5 py-5">
      <h3 className="text-lg font-semibold text-slate-900">高度診断のご提案（Plan3）</h3>
      <p className="text-sm text-slate-600">
        {plan3Summary(plan0)}
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li>必要に応じて専門家を交えたディスカッションを設定します。</li>
        <li>追加資料は最小限に留め、対面での意思決定を支援します。</li>
      </ul>
    </section>
  </FadeTransition>
);

const Plan4Card = ({ plan0 }: { plan0: Plan0State }) => {
  const selected = specializedThemes.filter((item) => plan0.specializedThemes.includes(item.id));
  return (
    <FadeTransition show={selected.length > 0}>
      <section className="yorozu-card space-y-3 rounded-2xl border px-5 py-5">
        <h3 className="text-lg font-semibold text-slate-900">専門テーマの事前準備（Plan4）</h3>
        <p className="text-sm text-slate-600">
          専門的な論点について、初回面談までに把握したいポイントを共有します。
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {selected.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </FadeTransition>
  );
};

export const DynamicPanel = ({
  derived,
  plan0,
  checklist,
  onToggleChecklistItem,
  liveMessage,
}: DynamicPanelProps) => {
  const [teaserOpen, setTeaserOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);

  const proposalBody = useMemo(() => {
    if (derived.isProvisionalFinal) {
      return "緊急度が高いため、まずは簡易提案の手順で即日論点整理を行い、対面で意思決定につなげます。";
    }
    return "Plan1・Plan2の最小資料で状況を共有し、対面面談で次の一手をご一緒に検討します。";
  }, [derived.isProvisionalFinal]);

  return (
    <div className="space-y-5">
      <div aria-live="polite" role="status" className="sr-only">
        {liveMessage || "表示内容を更新しました。"}
      </div>

      {derived.showTeaser && (
        <FadeTransition show>
          <section className="yorozu-card space-y-3 rounded-2xl border px-5 py-5">
            <h3 className="text-lg font-semibold text-slate-900">
              まずは全体像から整えましょう（簡易提案）
            </h3>
            <p className="text-sm text-slate-600">
              提出負担を抑えつつ、早期に全体像を共有する進め方です。
            </p>
            <button
              type="button"
              onClick={() => setTeaserOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-blue-500 px-4 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              全文を見る
            </button>
          </section>
        </FadeTransition>
      )}

      <section className="space-y-4">
        <header>
          <h2 className="text-xl font-bold text-slate-900">必要資料（テーマ別）</h2>
          <p className="text-sm text-slate-600">
            Plan1で必要となる資料をテーマごとにご案内します。提出状況に応じてステータスを切り替えてください。
          </p>
        </header>
        <Plan1Cards
          derived={derived}
          checklist={checklist}
          onToggle={onToggleChecklistItem}
        />
      </section>

      <Plan2Card derived={derived} />

      <Plan3Card derived={derived} plan0={plan0} />

      <Plan4Card plan0={plan0} />

      <section className="yorozu-card space-y-4 rounded-2xl border px-5 py-5">
        <header className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">ご提案</h3>
          {derived.isProvisionalFinal && (
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              暫定最終提案
            </span>
          )}
        </header>
        <p className="text-sm text-slate-600">
          {proposalBody}
        </p>
        <button
          type="button"
          onClick={() => setCtaOpen(true)}
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          対面相談を予約する
        </button>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500">
        入力内容を確認のうえ、右側のチェックリストをご活用ください。
      </div>

      <Modal open={teaserOpen} title="簡易提案（全文）" onClose={() => setTeaserOpen(false)}>
        <p>Plan0の入力結果をもとに、該当するPlan1の最小資料から着手します。</p>
        <p>「総合診断希望」がある場合は、Plan2の最小セット（決算3期・売上構造 等）で全体像を把握します。</p>
        <p>初回は30〜60分の対面にて論点を絞り、追加資料は必要最小限に限定します。</p>
        <p>高度な検討が必要な場合は、次回以降にPlan3の同意事項の要旨をご確認いただきます。</p>
        <p>※ いずれの場合も、最終的には対面での確認を前提としています。</p>
      </Modal>

      <Modal
        open={ctaOpen}
        title="対面相談の予約について"
        onClose={() => setCtaOpen(false)}
      >
        <p>予約は本番環境で承ります。本デモ画面では入力内容の保存や送信は行われません。</p>
        <p>引き続き入力内容をご確認いただき、対面でのご相談をご検討ください。</p>
      </Modal>
    </div>
  );
};
