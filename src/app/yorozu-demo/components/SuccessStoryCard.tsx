"use client";

import { SuccessStory } from "@/lib/types";
import { getPrefectureName } from "@/lib/utils/prefecture";

type SuccessStoryCardProps = {
  story: SuccessStory;
  action?: React.ReactNode;
};

export const SuccessStoryCard = ({ story, action }: SuccessStoryCardProps) => (
  <article className="yorozu-card flex flex-col gap-3 rounded-xl border px-5 py-4">
    <div className="flex items-center justify-between text-sm text-slate-500">
      <span>{getPrefectureName(story.prefCode)}</span>
      <div className="flex flex-wrap gap-1">
        {story.categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
          >
            {category}
          </span>
        ))}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-slate-900">{story.title}</h3>
    <p className="text-sm text-slate-600">{story.summary}</p>
    <p className="text-sm font-semibold text-slate-700">
      成果: <span className="font-normal text-slate-600">{story.outcome}</span>
    </p>
    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
      {story.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600"
        >
          #{tag}
        </span>
      ))}
    </div>
    {action}
  </article>
);
