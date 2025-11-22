"use client";

import clsx from "clsx";

import { ksunsSubCategoriesMap } from "@/lib/mockData/ksunsCategories";
import { FoodMainCategory } from "@/lib/types";

type SubcategorySelectorProps = {
  mainCategory: FoodMainCategory | null;
  selected: string | null;
  onSelect: (subcategory: string) => void;
};

export const SubcategorySelector = ({
  mainCategory,
  selected,
  onSelect,
}: SubcategorySelectorProps) => {
  if (!mainCategory) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
        メインジャンルを選択すると、関連するサブカテゴリが表示されます。
      </section>
    );
  }

  const subcategories = ksunsSubCategoriesMap[mainCategory];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          ③ SUB GENRE
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          {mainCategory} - サブジャンルを絞り込み
        </h2>
        <p className="text-sm text-slate-600">
          メインカテゴリ変更時には自動でサブカテゴリをリセットします。現在の選択内容に合わせて AI のタッチポイントを変化させます。
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            type="button"
            onClick={() => onSelect(subcategory)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              selected === subcategory
                ? "border-transparent bg-blue-600 text-white shadow"
                : "border-slate-300 bg-white text-slate-700 hover:border-blue-400",
            )}
          >
            {subcategory}
          </button>
        ))}
      </div>
    </section>
  );
};
