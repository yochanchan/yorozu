"use client";

import clsx from "clsx";

import { ksunsMainCategories } from "@/lib/mockData/ksunsCategories";
import { FoodMainCategory } from "@/lib/types";

type CategoryGridProps = {
  selected: FoodMainCategory | null;
  onSelect: (category: FoodMainCategory) => void;
};

export const CategoryGrid = ({ selected, onSelect }: CategoryGridProps) => (
  <section id="ksuns-main-category" className="space-y-4">
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        ② MAIN GENRE
      </p>
      <h2 className="text-2xl font-bold text-slate-900">メインジャンルを選択</h2>
      <p className="text-sm text-slate-600">
        12 のカテゴリをカード形式で表示します。スマートフォンでは横 2 列のカードとして配置し、タップしやすい領域を確保しています。
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {ksunsMainCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={clsx(
            "flex flex-col rounded-2xl border px-4 py-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            selected === category.id
              ? "border-transparent bg-slate-900 text-white shadow-lg"
              : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
          )}
          style={
            selected === category.id
              ? { boxShadow: `0 15px 35px ${category.accent}33` }
              : undefined
          }
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {category.id}
          </span>
          <p
            className={clsx(
              "mt-2 text-xl font-bold",
              selected === category.id ? "text-white" : "text-slate-900",
            )}
          >
            {category.title}
          </p>
          <p
            className={clsx(
              "mt-2 text-sm leading-relaxed",
              selected === category.id ? "text-slate-200" : "text-slate-600",
            )}
          >
            {category.description}
          </p>
        </button>
      ))}
    </div>
  </section>
);
