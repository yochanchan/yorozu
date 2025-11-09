import { prefectures } from "@/lib/mockData/prefectures";
import { MonthlyTrend } from "@/lib/types";

const fiscalMonths = [
  { month: 4, base: 780 },
  { month: 5, base: 820 },
  { month: 6, base: 860 },
  { month: 7, base: 900 },
  { month: 8, base: 880 },
  { month: 9, base: 940 },
  { month: 10, base: 970 },
  { month: 11, base: 1010 },
  { month: 12, base: 990 },
  { month: 1, base: 930 },
  { month: 2, base: 960 },
  { month: 3, base: 1040 },
];

const buildMonths = (factor: number) =>
  fiscalMonths.map(({ month, base }, index) => {
    const adjusted = Math.round(base * factor + index * 6);
    return {
      month,
      consultations: adjusted,
      solved: Math.round(adjusted * 0.64),
      transfer: Math.round(adjusted * 0.12),
    };
  });

const nationalTrends: MonthlyTrend[] = [
  {
    year: 2024,
    prefCode: "ALL",
    months: buildMonths(0.92),
  },
  {
    year: 2025,
    prefCode: "ALL",
    months: buildMonths(1.0),
  },
];

const prefectureTrends: MonthlyTrend[] = prefectures.map((pref, index) => {
  const factor = 0.12 + (index % 5) * 0.02;
  return {
    year: 2025,
    prefCode: pref.code,
    months: fiscalMonths.map(({ month }, monthIndex) => {
      const base = 90 + (index % 7) * 12 + monthIndex * 4;
      const consultations = Math.max(
        40,
        Math.round(base * (1 + factor)),
      );
      return {
        month,
        consultations,
        solved: Math.round(consultations * 0.66),
        transfer: Math.round(consultations * 0.13),
      };
    }),
  };
});

export const monthlyTrends: MonthlyTrend[] = [
  ...nationalTrends,
  ...prefectureTrends,
];

export const getMonthlyTrend = (
  prefCode: string,
  year: number,
): MonthlyTrend | undefined =>
  monthlyTrends.find(
    (trend) => trend.prefCode === prefCode && trend.year === year,
  );
