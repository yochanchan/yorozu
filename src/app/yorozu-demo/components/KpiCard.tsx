"use client";

import { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  trendLabel?: string;
  trendValue?: string;
};

export const KpiCard = ({
  label,
  value,
  description,
  icon,
  trendLabel,
  trendValue,
}: KpiCardProps) => (
  <div className="yorozu-card flex h-full flex-col gap-2 rounded-xl border px-5 py-4">
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    {description && (
      <p className="text-xs text-slate-500">{description}</p>
    )}
    {trendLabel && trendValue && (
      <div className="mt-auto text-xs">
        <span className="font-semibold text-blue-700">{trendValue}</span>{" "}
        <span className="text-slate-500">{trendLabel}</span>
      </div>
    )}
  </div>
);
