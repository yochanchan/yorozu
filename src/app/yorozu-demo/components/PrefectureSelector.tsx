"use client";

import { prefectures } from "@/lib/mockData/prefectures";

type PrefectureSelectorProps = {
  value: string;
  onChange: (code: string) => void;
  label?: string;
};

export const PrefectureSelector = ({
  value,
  onChange,
  label = "拠点選択",
}: PrefectureSelectorProps) => (
  <label className="flex flex-col text-sm font-medium text-slate-600">
    {label}
    <select
      className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {prefectures.map((pref) => (
        <option key={pref.code} value={pref.code}>
          {pref.name}
        </option>
      ))}
    </select>
  </label>
);
