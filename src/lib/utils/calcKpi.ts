import { YearlySummary } from "@/lib/types";

export const calcSolveRate = (summary: YearlySummary) =>
  summary.consultations
    ? summary.solvedCount / summary.consultations
    : 0;

export const calcTransferRate = (summary: YearlySummary) =>
  summary.consultations
    ? summary.transferCount / summary.consultations
    : 0;

export const getTopCategories = (
  summary: YearlySummary,
  limit = 3,
): { name: string; value: number }[] =>
  Object.entries(summary.categoryShare)
    .map(([name, value]) => ({ name, value: value ?? 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
