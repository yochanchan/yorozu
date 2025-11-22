"use client";

import { useMemo, useState } from "react";

import { RadarChart } from "@/app/ksuns/mieru10/components/RadarChart";
import {
  defaultMieru10Notes,
  mieru10Items,
} from "@/lib/mockData/mieru10Items";
import { Mieru10Item, Mieru10Notes, Mieru10Scores } from "@/lib/types";

const ratingLabels: Record<number, string> = {
  0: "未着手",
  1: "ざっくりイメージのみ",
  2: "メモレベルで整理済み",
  3: "書面で整理済み",
  4: "専門家と確認済み",
  5: "実行準備・契約まで完了",
};

const noteScoreGuidelines = [
  { label: "0文字", value: "0点（未記載）" },
  { label: "1〜100文字", value: "1点" },
  { label: "101〜200文字", value: "2点" },
  { label: "201〜300文字", value: "3点" },
  { label: "301〜400文字", value: "4点" },
  { label: "401文字以上", value: "5点" },
];

const threshold = 3;

const noteLengthToScore = (note: string): number => {
  const length = note.trim().length;
  if (length === 0) return 0;
  if (length <= 100) return 1;
  if (length <= 200) return 2;
  if (length <= 300) return 3;
  if (length <= 400) return 4;
  return 5;
};

const computeScores = (notes: Mieru10Notes): Mieru10Scores =>
  mieru10Items.reduce((acc, item) => {
    acc[item.id] = noteLengthToScore(notes[item.id] ?? "");
    return acc;
  }, {} as Mieru10Scores);

const createInitialNotes = (): Mieru10Notes => ({ ...defaultMieru10Notes });

const getAdviceMessage = (item: Mieru10Item, note: string) => {
  const trimmed = note.trim();
  if (!trimmed) {
    return `まだ ${item.label} のノートが登録されていません。まずは現状や課題を 2〜3 行で書き出しましょう。${item.advice}`;
  }
  if (trimmed.length <= 200) {
    return `書き始めは確認できました。重要な数字や関係者との合意事項をもう少し具体的に書き足すと判断しやすくなります。${item.advice}`;
  }
  if (trimmed.length <= 350) {
    return `情報が整理されてきています。このまま実施スケジュールやチェックポイントを整理すると、実行段階の抜け漏れを防げます。${item.advice}`;
  }
  return `十分な分量が揃っています。専門家とのすり合わせや関係者レビューに回し、記載内容を裏付ける資料を確認しましょう。${item.advice}`;
};

const getStatusBadge = (score: number) => {
  if (score <= 2) {
    return {
      label: "要対応",
      className: "bg-red-100 text-red-700",
    };
  }
  if (score === 5) {
    return {
      label: "十分",
      className: "bg-emerald-100 text-emerald-700",
    };
  }
  return {
    label: "OK",
    className: "bg-amber-100 text-amber-700",
  };
};

const Mieru10Page = () => {
  const [draftNotes, setDraftNotes] = useState<Mieru10Notes>(
    createInitialNotes,
  );
  const [notes, setNotes] = useState<Mieru10Notes>(createInitialNotes);

  const appliedScores = useMemo(() => computeScores(notes), [notes]);
  const draftScores = useMemo(() => computeScores(draftNotes), [draftNotes]);

  const belowItems = useMemo(
    () =>
      mieru10Items.filter(
        (item) => (appliedScores[item.id] ?? 0) < item.threshold,
      ),
    [appliedScores],
  );

  const averageScore = useMemo(() => {
    const total = mieru10Items.reduce(
      (sum, item) => sum + (appliedScores[item.id] ?? 0),
      0,
    );
    return Number((total / mieru10Items.length).toFixed(1));
  }, [appliedScores]);

  const allClear = belowItems.length === 0;
  const hasPendingChanges = mieru10Items.some(
    (item) => draftNotes[item.id] !== notes[item.id],
  );

  const handleNoteChange = (itemId: Mieru10Item["id"], value: string) => {
    setDraftNotes((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleApply = () => {
    setNotes({ ...draftNotes });
  };

  const handleReset = () => {
    const initial = createInitialNotes();
    setDraftNotes(initial);
    setNotes(initial);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            飲食店開業 10項目セルフチェック
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            飲食店開業 10項目セルフチェック
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            10項目を 5 段階で評価してください。検討状況ノートを入力し、その文字数に応じてスコアが自動で変動します。
            すべてが合格ライン（スコア 3.0 以上）を超えるとレーダーチャートが「開業OK」カラーに切り替わります。
          </p>
          <div
            className={`mt-4 rounded-2xl border px-5 py-4 text-sm font-semibold ${
              allClear
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-orange-200 bg-orange-50 text-orange-800"
            }`}
          >
            {allClear
              ? "全10項目が合格ラインに達しました。詳細を詰めれば、開業準備は現実的なレベルです。"
              : "開業前に、以下の項目をもう一歩だけ具体化しましょう。"}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <RadarChart items={mieru10Items} scores={appliedScores} threshold={3} />
          <section className="space-y-5 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                全体診断
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {allClear ? "開業準備は概ね整っています" : "要検討項目があります"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                合格ライン = {threshold}。平均スコアと 3 未満の項目数を参考に、次のアクションを洗い出してください。
              </p>
            </div>
            <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  平均スコア
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {averageScore.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  3未満の項目数
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {belowItems.length} / 10
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                要対応リスト
              </p>
              {belowItems.length === 0 ? (
                <p className="mt-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  現時点では要対応の項目はありません。
                </p>
              ) : (
                <ul className="mt-3 space-y-3 text-sm text-slate-600">
                  {belowItems.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3"
                    >
                      <p className="font-semibold text-red-700">{item.label}</p>
                      <p className="mt-1">{item.advice}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              評価入力エリア
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              ノートを更新してスコアを算出
            </h2>
            <p className="text-sm text-slate-600">
              入力したノートの文字数に応じてスコアが決まります。編集後に「診断結果を更新」を押すとレーダーチャートと AI
              モックアドバイスが反映されます。
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
            {Object.entries(ratingLabels).map(([value, label]) => (
              <span
                key={value}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
              >
                {value}点: {label}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            {noteScoreGuidelines.map((guide) => (
              <span
                key={guide.label}
                className="rounded-full border border-dashed border-slate-200 bg-white px-3 py-1"
              >
                {guide.label} → {guide.value}
              </span>
            ))}
          </div>

          <div className="mt-6 space-y-5">
            {mieru10Items.map((item) => {
              const draftNote = draftNotes[item.id] ?? "";
              const appliedNote = notes[item.id] ?? "";
              const draftScore = draftScores[item.id] ?? 0;
              const appliedScore = appliedScores[item.id] ?? 0;
              const badge = getStatusBadge(appliedScore);
              const adviceMessage = getAdviceMessage(item, appliedNote);
              const noteLength = draftNote.trim().length;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.label}
                      </p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                    >
                      {badge.label}（現在: {appliedScore} 点）
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      検討状況ノート
                      <textarea
                        value={draftNote}
                        onChange={(event) =>
                          handleNoteChange(item.id, event.target.value)
                        }
                        placeholder="例: ターゲットは近隣オフィスの30〜40代。客単価3,500円でランチ・ディナーの2部制を予定。想定席数28、内装コンセプトは..."
                        maxLength={600}
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>入力文字数: {noteLength} 字</span>
                      <span>
                        仮スコア: {draftScore} 点（{ratingLabels[draftScore]}）
                      </span>
                      <span>※ 600 文字まで入力可能</span>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                        AIモックアドバイス
                      </p>
                      <p className="mt-1">{adviceMessage}</p>
                      {hasPendingChanges && (
                        <p className="mt-2 text-xs text-slate-400">
                          ※ ノートを更新した内容を反映するには「診断結果を更新」を押してください。
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleApply}
              disabled={!hasPendingChanges}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              診断結果を更新
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              初期値に戻す
            </button>
            {!hasPendingChanges && (
              <span className="text-xs text-slate-500">
                変更がないためボタンはグレーアウトしています。
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mieru10Page;
