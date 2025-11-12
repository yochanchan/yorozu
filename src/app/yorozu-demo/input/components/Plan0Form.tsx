"use client";

import {
  employeesRangeOptions,
  prefectureOptions,
  revenueRangeOptions,
  specializedThemes as specializedThemeDefinitions,
  themeDefinitions,
  timeHorizonOptions,
  urgencyOptions,
} from "../constants";
import { ErrorSummaryItem, Plan0Draft } from "../hooks";
import {
  EmployeesRange,
  RevenueRange,
  TimeHorizon,
  Urgency,
  ValidationErrors,
} from "../types";

type Plan0FormProps = {
  draft: Plan0Draft;
  industries: string[];
  errors: ValidationErrors;
  errorSummary: ErrorSummaryItem[];
  onCompanyNameChange: (value: string) => void;
  onPrefectureChange: (value: string) => void;
  onIndustrySelectChange: (value: string) => void;
  onIndustryFreeChange: (value: string) => void;
  onEmployeesRangeChange: (value: EmployeesRange) => void;
  onRevenueRangeChange: (value: RevenueRange) => void;
  onFoundedYearChange: (value: string) => void;
  onTimeHorizonChange: (value: TimeHorizon) => void;
  onUrgencyChange: (value: Urgency) => void;
  onToggleTheme: (themeId: string) => void;
  onToggleSpecializedTheme: (id: string) => void;
  isThemeDisabled: (themeId: string) => boolean;
  notifyThemeLimit: () => void;
};

const RequiredMark = () => (
  <abbr
    title="必須項目です"
    className="ml-1 text-red-600 no-underline"
    aria-hidden="true"
  >
    *
  </abbr>
);

export const Plan0Form = ({
  draft,
  industries,
  errors,
  errorSummary,
  onCompanyNameChange,
  onPrefectureChange,
  onIndustrySelectChange,
  onIndustryFreeChange,
  onEmployeesRangeChange,
  onRevenueRangeChange,
  onFoundedYearChange,
  onTimeHorizonChange,
  onUrgencyChange,
  onToggleTheme,
  onToggleSpecializedTheme,
  isThemeDisabled,
  notifyThemeLimit,
}: Plan0FormProps) => (
  <section className="yorozu-card space-y-6 rounded-2xl border px-6 py-6">
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
        Plan0
      </p>
      <h2 className="text-2xl font-bold text-slate-900">
        共通インプット（相談前ヒアリング）
      </h2>
      <p className="text-sm text-slate-500">
        右側の必要資料パネルとご提案カードに即時反映されます。必須項目を入力してください。
      </p>
    </header>

    {errorSummary.length > 0 && (
      <div
        role="alert"
        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
      >
        <p className="font-semibold">入力内容をご確認ください。</p>
        <ul className="mt-2 space-y-1">
          {errorSummary.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="underline-offset-2 hover:underline"
              >
                {item.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2" id="companyName">
        <label className="text-sm font-medium text-slate-700" htmlFor="companyNameInput">
          会社名<RequiredMark />
        </label>
        <input
          id="companyNameInput"
          type="text"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={draft.companyName}
          onChange={(event) => onCompanyNameChange(event.target.value)}
          aria-invalid={Boolean(errors.companyName)}
          aria-describedby={errors.companyName ? "companyName-error" : undefined}
        />
        {errors.companyName && (
          <p id="companyName-error" className="text-sm text-orange-600">
            {errors.companyName}
          </p>
        )}
      </div>
      <div className="space-y-2" id="prefecture">
        <label className="text-sm font-medium text-slate-700" htmlFor="prefectureSelect">
          都道府県<RequiredMark />
        </label>
        <select
          id="prefectureSelect"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={draft.prefecture}
          onChange={(event) => onPrefectureChange(event.target.value)}
          aria-invalid={Boolean(errors.prefecture)}
          aria-describedby={errors.prefecture ? "prefecture-error" : undefined}
        >
          <option value="">選択してください</option>
          {prefectureOptions.map((pref) => (
            <option key={pref.value} value={pref.value}>
              {pref.label}
            </option>
          ))}
        </select>
        {errors.prefecture && (
          <p id="prefecture-error" className="text-sm text-orange-600">
            {errors.prefecture}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-3" id="industry-group">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="industrySelect">
            業種（選択）
          </label>
          <select
            id="industrySelect"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={draft.industrySelect}
            onChange={(event) => onIndustrySelectChange(event.target.value)}
            aria-invalid={Boolean(errors.industryGroup)}
          >
            <option value="">選択してください</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="industryFree">
            業種（自由記述）
          </label>
          <input
            id="industryFree"
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={draft.industryFree}
            onChange={(event) => onIndustryFreeChange(event.target.value)}
            placeholder="例：精密部品の試作" 
            aria-invalid={Boolean(errors.industryGroup)}
          />
        </div>
      </div>
      {errors.industryGroup && (
        <p className="text-sm text-orange-600">{errors.industryGroup}</p>
      )}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2" id="employeesRange">
        <label className="text-sm font-medium text-slate-700" htmlFor="employeesRangeSelect">
          従業員数レンジ<RequiredMark />
        </label>
        <select
          id="employeesRangeSelect"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={draft.employeesRange}
          onChange={(event) =>
            onEmployeesRangeChange(event.target.value as EmployeesRange)
          }
          aria-invalid={Boolean(errors.employeesRange)}
          aria-describedby={errors.employeesRange ? "employeesRange-error" : undefined}
        >
          <option value="">選択してください</option>
          {employeesRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.employeesRange && (
          <p id="employeesRange-error" className="text-sm text-orange-600">
            {errors.employeesRange}
          </p>
        )}
      </div>
      <div className="space-y-2" id="revenueRange">
        <label className="text-sm font-medium text-slate-700" htmlFor="revenueRangeSelect">
          売上高レンジ<RequiredMark />
        </label>
        <select
          id="revenueRangeSelect"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={draft.revenueRange}
          onChange={(event) =>
            onRevenueRangeChange(event.target.value as RevenueRange)
          }
          aria-invalid={Boolean(errors.revenueRange)}
          aria-describedby={errors.revenueRange ? "revenueRange-error" : undefined}
        >
          <option value="">選択してください</option>
          {revenueRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.revenueRange && (
          <p id="revenueRange-error" className="text-sm text-orange-600">
            {errors.revenueRange}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-2" id="foundedYear">
      <label className="text-sm font-medium text-slate-700" htmlFor="foundedYearInput">
        創業年（任意）
      </label>
      <input
        id="foundedYearInput"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
        value={draft.foundedYear}
        onChange={(event) => onFoundedYearChange(event.target.value)}
        placeholder="例：2005"
        aria-invalid={Boolean(errors.foundedYear)}
        aria-describedby={errors.foundedYear ? "foundedYear-error" : undefined}
      />
      {errors.foundedYear && (
        <p id="foundedYear-error" className="text-sm text-orange-600">
          {errors.foundedYear}
        </p>
      )}
    </div>

    <div className="space-y-3" id="themes">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          今日相談したいテーマ（1〜3件）<RequiredMark />
        </h3>
        <span className="text-xs text-slate-500">
          選択数：{draft.themes.length} / 3
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {themeDefinitions.map((theme) => {
          const checked = draft.themes.includes(theme.id);
          const disabled = isThemeDisabled(theme.id);
          return (
            <label
              key={theme.id}
              className={`flex items-start gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                checked
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700"
              } ${disabled ? "opacity-60" : ""}`}
              onMouseDown={(event) => {
                if (disabled) {
                  event.preventDefault();
                  notifyThemeLimit();
                }
              }}
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={checked}
                disabled={disabled && !checked}
                onChange={() => onToggleTheme(theme.id)}
              />
              <span>
                <span className="font-semibold">{theme.label}</span>
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  {theme.depth === "deep" ? "重点" : "通常"}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {errors.themes && (
        <p className="text-sm text-orange-600">{errors.themes}</p>
      )}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2" id="timeHorizon">
        <p className="text-sm font-medium text-slate-700">
          時間軸<RequiredMark />
        </p>
        <div className="flex flex-wrap gap-2">
          {timeHorizonOptions.map((option) => {
            const checked = draft.timeHorizon === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition ${
                  checked
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="timeHorizon"
                  className="hidden"
                  checked={checked}
                  onChange={() =>
                    onTimeHorizonChange(option.value as TimeHorizon)
                  }
                />
                {option.label}
              </label>
            );
          })}
        </div>
        {errors.timeHorizon && (
          <p className="text-sm text-orange-600">{errors.timeHorizon}</p>
        )}
      </div>
      <div className="space-y-2" id="urgency">
        <p className="text-sm font-medium text-slate-700">
          緊急度<RequiredMark />
        </p>
        <div className="flex flex-wrap gap-2">
          {urgencyOptions.map((option) => {
            const checked = draft.urgency === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition ${
                  checked
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  className="hidden"
                  checked={checked}
                  onChange={() => onUrgencyChange(option.value as Urgency)}
                />
                {option.label}
              </label>
            );
          })}
        </div>
        {errors.urgency && (
          <p className="text-sm text-orange-600">{errors.urgency}</p>
        )}
      </div>
    </div>

    <div className="space-y-3" id="specializedThemes">
      <h3 className="text-lg font-semibold text-slate-900">
        専門テーマ（任意・複数選択可）
      </h3>
      <p className="text-sm text-slate-500">
        高度な専門相談は担当者の調整に時間を要するため、回答まで1〜3週間程度を想定してください。
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {specializedThemeDefinitions.map((item) => {
          const checked = draft.specializedThemes.includes(item.id);
          return (
            <label
              key={item.id}
              className={`flex flex-col gap-1 rounded-xl border px-3 py-3 text-sm transition ${
                checked
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleSpecializedTheme(item.id)}
                  />
                  <span className="font-semibold">{item.label}</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                  {item.waitEstimate}
                </span>
              </span>
              <span className="text-xs text-slate-500">{item.description}</span>
            </label>
          );
        })}
      </div>
    </div>
  </section>
);
