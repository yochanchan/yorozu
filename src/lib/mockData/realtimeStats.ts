import { prefectures } from "@/lib/mockData/prefectures";
import { PrefectureRealtimeStat } from "@/lib/types";

export const prefectureRealtimeStats: Record<string, PrefectureRealtimeStat> =
  prefectures.reduce((acc, pref, index) => {
    acc[pref.code] = {
      todayConsultations: 4 + (index % 4),
      monthConsultations: 48 + (index % 7) * 5,
    };
    return acc;
  }, {} as Record<string, PrefectureRealtimeStat>);

export const nationalRealtimeStats = {
  todayConsultations: Object.values(prefectureRealtimeStats).reduce(
    (sum, stat) => sum + stat.todayConsultations,
    0,
  ),
  monthConsultations: Object.values(prefectureRealtimeStats).reduce(
    (sum, stat) => sum + stat.monthConsultations,
    0,
  ),
};
