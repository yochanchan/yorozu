import { prefectures } from "@/lib/mockData/prefectures";

export const getPrefectureByCode = (code: string) =>
  prefectures.find((pref) => pref.code === code);

export const getPrefectureName = (code: string) =>
  getPrefectureByCode(code)?.name ?? "不明";
