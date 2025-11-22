"use client";

import { useMemo, useState } from "react";

import { KsunsTimeSlot } from "@/lib/types";
import { useKsunsPlanner } from "@/app/ksuns/context/KsunsPlannerContext";
import {
  KsunsFormErrors,
  validateKsunsForm,
} from "@/app/ksuns/utils/validation";

const locationOptions = [
  { value: "駅チカ", description: "駅徒歩 5 分圏内" },
  { value: "住宅街", description: "ファミリー層中心" },
  { value: "オフィス街", description: "平日日中の需要が高い" },
  { value: "観光地", description: "週末・季節要因が強く影響" },
  { value: "郊外", description: "車移動・滞在型ニーズ" },
] as const;

const StepBadge = ({ completed }: { completed: boolean }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
      completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
    }`}
  >
    {completed ? "DONE" : "待機中"}
  </span>
);

export const PlannerForm = () => {
  const {
    form,
    updateFormField,
    updateTimeSlot,
    addTimeSlot,
    removeTimeSlot,
  } = useKsunsPlanner();

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [slotTouched, setSlotTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => validateKsunsForm(form), [form]);
  const slotErrors = errors.timeSlots ?? {};

  const segments = [
    { label: "座席数", done: form.seats !== "" && !errors.seats },
    { label: "客単価", done: form.unitPrice !== "" && !errors.unitPrice },
    {
      label: "営業時間",
      done:
        form.timeSlots.length > 0 &&
        form.timeSlots.every((slot) => !slotErrors[slot.id]),
    },
    { label: "立地・補足", done: true },
  ];
  const completion =
    (segments.filter((segment) => segment.done).length / segments.length) * 100;

  const handleNumberChange = (
    key: "seats" | "unitPrice",
    value: number,
    errorKey: keyof KsunsFormErrors,
  ) => {
    setTouched((prev) => ({ ...prev, [errorKey]: true }));
    if (Number.isNaN(value)) {
      updateFormField(key, "");
    } else {
      updateFormField(key, value);
    }
  };

  const handleSlotChange = (
    slot: KsunsTimeSlot,
    patch: Partial<KsunsTimeSlot>,
  ) => {
    setSlotTouched((prev) => ({ ...prev, [slot.id]: true }));
    updateTimeSlot(slot.id, patch);
  };

  return (
    <section
      id="ksuns-planner"
      className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          ④ CONFIG FORM
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          簡易シミュレーション情報を入力
        </h2>
        <p className="text-sm text-slate-600">
          数値と営業時間を入力するとリアルタイムでバリデーションを行い、結果画面に安全に引き継ぎます。
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">入力進捗</span>
          <span>{Math.round(completion)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-4">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
            >
              <span>{segment.label}</span>
              <StepBadge completed={segment.done} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          座席数（1〜200）
          <input
            type="number"
            min={1}
            max={200}
            value={form.seats === "" ? "" : form.seats}
            onChange={(event) =>
              handleNumberChange("seats", event.target.valueAsNumber, "seats")
            }
            onBlur={() => setTouched((prev) => ({ ...prev, seats: true }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.seats && errors.seats && (
            <p className="mt-1 text-sm text-red-600">{errors.seats}</p>
          )}
        </label>

        <label className="text-sm font-medium text-slate-600">
          想定客単価（円）
          <input
            type="number"
            min={1}
            max={20_000}
            step={100}
            value={form.unitPrice === "" ? "" : form.unitPrice}
            onChange={(event) =>
              handleNumberChange(
                "unitPrice",
                event.target.valueAsNumber,
                "unitPrice",
              )
            }
            onBlur={() => setTouched((prev) => ({ ...prev, unitPrice: true }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.unitPrice && errors.unitPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>
          )}
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-slate-900">営業時間枠</h3>
          <p className="text-sm text-slate-500">
            複数枠を柔軟に追加できます。メインカテゴリ変更時も入力が保持されるため、比較検討が楽になります。
          </p>
        </div>
        <div className="space-y-3">
          {form.timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                <label className="flex-1 text-sm font-medium text-slate-600">
                  区分ラベル
                  <input
                    type="text"
                    value={slot.label}
                    onChange={(event) =>
                      handleSlotChange(slot, { label: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="flex-1 text-sm font-medium text-slate-600">
                  開始
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(event) =>
                      handleSlotChange(slot, { start: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="flex-1 text-sm font-medium text-slate-600">
                  終了
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(event) =>
                      handleSlotChange(slot, { end: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                {form.timeSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(slot.id)}
                    className="self-start rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                  >
                    枠を削除
                  </button>
                )}
              </div>
              {slotTouched[slot.id] && slotErrors[slot.id] && (
                <p className="mt-2 text-sm text-red-600">{slotErrors[slot.id]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addTimeSlot}
            disabled={form.timeSlots.length >= 4}
            className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition enabled:hover:border-blue-400 enabled:hover:text-blue-700 disabled:opacity-50"
          >
            営業枠を追加
          </button>
          <span className="text-xs text-slate-400">
            最大 4 枠まで登録できます。
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <label className="text-sm font-medium text-slate-600">
          立地イメージ
          <select
            value={form.locationProfile}
            onChange={(event) =>
              updateFormField(
                "locationProfile",
                event.target.value as (typeof locationOptions)[number]["value"],
              )
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} - {option.description}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-600">
          その他オプション（任意）
          <input
            type="text"
            placeholder="例: 夜はライブ演奏／ビーガン対応"
            value={form.notes}
            onChange={(event) => updateFormField("notes", event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>
    </section>
  );
};
