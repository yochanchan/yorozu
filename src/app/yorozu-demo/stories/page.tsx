"use client";

import { useMemo, useState } from "react";

import { SuccessStoryCard } from "@/app/yorozu-demo/components/SuccessStoryCard";
import { consultationCategories } from "@/lib/mockData/categories";
import { prefectures } from "@/lib/mockData/prefectures";
import { successStories } from "@/lib/mockData/successStories";
import { ConsultationCategory } from "@/lib/types";

const StoriesPage = () => {
  const [category, setCategory] = useState<ConsultationCategory | "すべて">(
    "すべて",
  );
  const [prefCode, setPrefCode] = useState<string>("ALL");

  const filteredStories = useMemo(() => {
    return successStories.filter((story) => {
      const matchCategory =
        category === "すべて" || story.categories.includes(category);
      const matchPref = prefCode === "ALL" || story.prefCode === prefCode;
      return matchCategory && matchPref;
    });
  }, [category, prefCode]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
          成功事例
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          全国の知見共有イメージ
        </h1>
        <p className="text-sm text-slate-600">
          匿名加工された代表事例をカテゴリ・都道府県で切り替えて確認できます。
        </p>
      </div>
      <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as ConsultationCategory | "すべて")
          }
          className="rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="すべて">カテゴリ：すべて</option>
          {consultationCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={prefCode}
          onChange={(event) => setPrefCode(event.target.value)}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="ALL">都道府県：すべて</option>
          {prefectures.map((pref) => (
            <option key={pref.code} value={pref.code}>
              {pref.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4">
        {filteredStories.map((story) => (
          <SuccessStoryCard key={story.id} story={story} />
        ))}
        {filteredStories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            条件に該当する事例はありません。
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
