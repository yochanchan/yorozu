"use client";

import { useMemo, useState } from "react";

import { successStories } from "@/lib/mockData/successStories";
import { ConsultationCategory, SuccessStory } from "@/lib/types";
import { SuccessStoryCard } from "./SuccessStoryCard";

type RecommendationPanelProps = {
  industry: string;
  categories: ConsultationCategory[];
};

const transferOptions = ["他拠点", "全国本部", "他支援機関"];

export const RecommendationPanel = ({
  industry,
  categories,
}: RecommendationPanelProps) => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [transferStory, setTransferStory] = useState<SuccessStory | null>(null);
  const [transferType, setTransferType] = useState(transferOptions[0]);
  const [transferNote, setTransferNote] = useState("");

  const normalizedIndustry = (industry ?? "").trim();
  const activeCategories = useMemo(
    () => categories.filter((category) => category && category.length > 0),
    [categories],
  );

  const hasIndustry = normalizedIndustry.length > 0;
  const hasCategory = activeCategories.length > 0;

  const recommendedStories = useMemo(() => {
    if (!hasIndustry && !hasCategory) {
      return [];
    }

    const matchIndustry = (story: SuccessStory) =>
      !hasIndustry || story.industry === normalizedIndustry;
    const matchCategory = (story: SuccessStory) =>
      !hasCategory ||
      story.categories.some((category) =>
        activeCategories.includes(category),
      );

    const filtered = successStories.filter((story) => {
      if (hasIndustry && hasCategory) {
        return (
          story.industry === normalizedIndustry &&
          matchCategory(story)
        );
      }
      if (hasIndustry) {
        return matchIndustry(story);
      }
      return matchCategory(story);
    });

    return filtered.slice(0, 4);
  }, [activeCategories, hasCategory, hasIndustry, normalizedIndustry]);

  return (
    <div className="yorozu-card flex flex-col gap-6 rounded-2xl border px-6 py-6">
      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            入力内容に基づく参考事例（デモ）
          </h3>
          <p className="text-xs text-slate-500">業種・相談類型で抽出</p>
        </div>
        <div className="mt-4 space-y-4">
          {!hasIndustry && !hasCategory ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              業種または相談類型を選択すると参考事例が表示されます。
            </div>
          ) : recommendedStories.length > 0 ? (
            recommendedStories.map((story) => (
              <SuccessStoryCard
                key={story.id}
                story={story}
                action={
                  <div className="flex flex-col items-center gap-2 text-sm text-blue-700">
                    <button
                      type="button"
                      className="font-semibold underline-offset-2 hover:underline"
                      onClick={() => setSelectedStory(story)}
                    >
                      詳細を見る
                    </button>
                    <button
                      type="button"
                      className="font-semibold underline-offset-2 hover:underline"
                      onClick={() => {
                        setTransferStory(story);
                        setTransferType(transferOptions[0]);
                        setTransferNote("");
                      }}
                    >
                      取次依頼する
                    </button>
                  </div>
                }
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              該当する代表事例はありません（デモ）。条件を切り替えて再度お試しください。
            </div>
          )}
        </div>
      </section>

      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">
                  {selectedStory.tags.join(" / ")}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedStory.title}
                </h3>
              </div>
              <button
                className="text-sm text-slate-500 hover:text-slate-900"
                onClick={() => setSelectedStory(null)}
              >
                閉じる
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              {selectedStory.summary}
            </p>
            <h4 className="mt-6 text-sm font-semibold text-slate-900">
              主要支援内容
            </h4>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
              {selectedStory.keySupport.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              成果
              <span className="ml-2 font-normal text-slate-700">
                {selectedStory.outcome}
              </span>
            </p>
          </div>
        </div>
      )}

      {transferStory && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">取次依頼（デモ）</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {transferStory.title}
                </h3>
              </div>
              <button
                className="text-sm text-slate-500 hover:text-slate-900"
                onClick={() => setTransferStory(null)}
              >
                閉じる
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <label className="text-sm font-semibold text-slate-600">
                共有したい内容
                <textarea
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  rows={3}
                  value={transferNote}
                  onChange={(event) => setTransferNote(event.target.value)}
                  placeholder="背景や具体的な支援要望を記載してください。"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                取次先
                <select
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={transferType}
                  onChange={(event) => setTransferType(event.target.value)}
                >
                  {transferOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
                onClick={() => setTransferStory(null)}
              >
                キャンセル
              </button>
              <button
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={() => setTransferStory(null)}
              >
                送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
