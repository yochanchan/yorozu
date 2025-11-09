import { consultationCategories } from "@/lib/mockData/categories";
import { prefectures } from "@/lib/mockData/prefectures";
import { Prefecture, YearlySummary } from "@/lib/types";

type Region = Prefecture["region"];

const regionalCategoryTemplates: Record<
  Region,
  Record<string, number>
> = {
  "北海道・東北": {
    事業承継: 0.18,
    創業: 0.15,
    販路開拓: 0.24,
    資金繰り: 0.17,
    IT知識全般: 0.16,
    その他: 0.1,
  },
  関東: {
    事業承継: 0.14,
    創業: 0.18,
    販路開拓: 0.25,
    資金繰り: 0.14,
    IT知識全般: 0.2,
    その他: 0.09,
  },
  中部: {
    事業承継: 0.17,
    創業: 0.16,
    販路開拓: 0.23,
    資金繰り: 0.18,
    IT知識全般: 0.16,
    その他: 0.1,
  },
  近畿: {
    事業承継: 0.15,
    創業: 0.17,
    販路開拓: 0.26,
    資金繰り: 0.15,
    IT知識全般: 0.17,
    その他: 0.1,
  },
  "中国・四国": {
    事業承継: 0.2,
    創業: 0.14,
    販路開拓: 0.22,
    資金繰り: 0.19,
    IT知識全般: 0.15,
    その他: 0.1,
  },
  九州: {
    事業承継: 0.19,
    創業: 0.16,
    販路開拓: 0.23,
    資金繰り: 0.17,
    IT知識全般: 0.15,
    その他: 0.1,
  },
};

const normalizeShare = (
  share: Record<string, number>,
): Record<string, number> => {
  const total = Object.values(share).reduce((sum, value) => sum + value, 0);
  if (!total) {
    return share;
  }
  return Object.fromEntries(
    Object.entries(share).map(([key, value]) => [key, value / total]),
  );
};

const buildPrefSummary = (
  pref: Prefecture,
  year: number,
  index: number,
): YearlySummary => {
  const growth = year === 2025 ? 1.08 : 0.96;
  const base = 520 + index * 9;
  const consultations = Math.round(base * growth);
  const solvedRate = 0.6 + ((index % 5) * 0.02 + (year === 2025 ? 0.03 : 0));
  const transferRate = 0.1 + ((index % 4) * 0.01 + (year === 2025 ? 0.01 : 0));

  const template = { ...regionalCategoryTemplates[pref.region] };
  const shift = ((index % 4) - 1) * 0.01;
  template["販路開拓"] += shift;
  template["IT知識全般"] += shift / 2;
  template["その他"] -= shift / 2;
  const categoryShare = normalizeShare(template);

  return {
    year,
    level: "pref",
    prefCode: pref.code,
    consultations,
    solvedCount: Math.round(consultations * Math.min(solvedRate, 0.92)),
    transferCount: Math.round(consultations * Math.min(transferRate, 0.2)),
    coordinatorCount: 8 + (index % 7),
    categoryShare,
  };
};

const prefSummariesByYear: Record<number, YearlySummary[]> = {
  2024: [],
  2025: [],
};

prefectures.forEach((pref, index) => {
  prefSummariesByYear[2024].push(buildPrefSummary(pref, 2024, index));
  prefSummariesByYear[2025].push(buildPrefSummary(pref, 2025, index));
});
// Override 2025 totals using provided aggregates (closer to real-world values)
const real2025ConsultationsByPref: Record<string, number> = {
  "01": 4824, "02": 2885, "03": 2485, "04": 3742, "05": 1929, "06": 2261,
  "07": 2641, "08": 7708, "09": 6084, "10": 4164, "11": 8523, "12": 2927,
  "13": 2762, "14": 4544, "15": 2235, "16": 2838, "17": 4809, "18": 2351,
  "19": 4231, "20": 5388, "21": 3521, "22": 3205, "23": 2680, "24": 2418,
  "25": 2860, "26": 2546, "27": 4540, "28": 2281, "29": 4584, "30": 2761,
  "31": 2004, "32": 3672, "33": 8195, "34": 3053, "35": 4442, "36": 2327,
  "37": 3494, "38": 2435, "39": 2690, "40": 11103, "41": 5262, "42": 3762,
  "43": 3091, "44": 3774, "45": 3849, "46": 5198, "47": 2296,
};

// ③紹介（名寄せ）＋④連携（同席）の合算（累計）
const real2025TransfersByPref: Record<string, number> = {
  "01": 144 + 238, "02": 45 + 281, "03": 32 + 357, "04": 201 + 168,
  "05": 51 + 158, "06": 136 + 240, "07": 181 + 225, "08": 714 + 652,
  "09": 295 + 545, "10": 300 + 255, "11": 942 + 556, "12": 1066 + 395,
  "13": 702 + 670, "14": 604 + 262, "15": 178 + 314, "16": 192 + 257,
  "17": 537 + 492, "18": 273 + 473, "19": 442 + 487, "20": 382 + 613,
  "21": 270 + 193, "22": 165 + 249, "23": 280 + 569, "24": 290 + 184,
  "25": 84 + 246,  "26": 160 + 160, "27": 568 + 524, "28": 171 + 135,
  "29": 548 + 163, "30": 203 + 179, "31": 105 + 234, "32": 303 + 250,
  "33": 402 + 236, "34": 344 + 448, "35": 583 + 161, "36": 298 + 205,
  "37": 704 + 233, "38": 550 + 200, "39": 84 + 192,  "40": 553 + 90,
  "41": 114 + 237, "42": 127 + 77,  "43": 270 + 339, "44": 472 + 202,
  "45": 157 + 256, "46": 389 + 700, "47": 300 + 445,
};
// 2024 totals (consultations and outcomes) for per-prefecture solve rates
const real2024ConsultationsByPref: Record<string, number> = {
  "01": 11556, "02": 10419, "03": 11441, "04": 13225, "05": 7603,  "06": 9847,
  "07": 11866, "08": 29312, "09": 15505, "10": 12976, "11": 31117, "12": 12096,
  "13": 10934, "14": 13844, "15": 9062,  "16": 4620,  "17": 24016, "18": 16840,
  "19": 12006, "20": 17364, "21": 13490, "22": 9586,  "23": 9148,  "24": 12333,
  "25": 6216,  "26": 11610, "27": 19967, "28": 9512,  "29": 25628, "30": 11291,
  "31": 5009,  "32": 8505,  "33": 20109, "34": 11878, "35": 12039, "36": 5924,
  "37": 14753, "38": 16409, "39": 8554,  "40": 75430, "41": 15305, "42": 18862,
  "43": 14292, "44": 10695, "45": 15605, "46": 41440, "47": 8379,
};
const real2024OutcomesByPref: Record<string, number> = {
  "01": 160, "02": 45,  "03": 222, "04": 129, "05": 43,  "06": 90,
  "07": 60,  "08": 484, "09": 91,  "10": 140, "11": 660, "12": 173,
  "13": 102, "14": 292, "15": 168, "16": 38,  "17": 328, "18": 215,
  "19": 321, "20": 297, "21": 95,  "22": 201, "23": 45,  "24": 183,
  "25": 7,   "26": 118, "27": 237, "28": 29,  "29": 237, "30": 43,
  "31": 125, "32": 274, "33": 991, "34": 313, "35": 345, "36": 68,
  "37": 113, "38": 60,  "39": 36,  "40": 543, "41": 235, "42": 150,
  "43": 150, "44": 157, "45": 162, "46": 153, "47": 177,
};
const solvedRate2024ByPref: Record<string, number> = Object.fromEntries(
  Object.keys(real2024ConsultationsByPref).map((code) => {
    const cons = real2024ConsultationsByPref[code] || 1;
    const outc = real2024OutcomesByPref[code] || 0;
    // clamp to [0,1]
    const rate = Math.max(0, Math.min(1, outc / cons));
    return [code, rate];
  })
);

prefSummariesByYear[2024] = prefSummariesByYear[2024].map((s) => {
  const rate = solvedRate2024ByPref[s.prefCode!] ?? (s.consultations ? s.solvedCount / s.consultations : 0);
  return { ...s, solvedCount: Math.round(s.consultations * rate) };
});

prefSummariesByYear[2025] = prefSummariesByYear[2025].map((s) => {
  const consultations = real2025ConsultationsByPref[s.prefCode!] ?? s.consultations;
  const transfer = real2025TransfersByPref[s.prefCode!] ?? s.transferCount;
  const rate = solvedRate2024ByPref[s.prefCode!] ?? 0;
  const solved = Math.round(consultations * rate);
  return { ...s, consultations, solvedCount: solved, transferCount: transfer };
});

const buildNationalSummary = (year: number): YearlySummary => {
  const prefSummaries = prefSummariesByYear[year];
  const totals = prefSummaries.reduce(
    (acc, summary) => {
      acc.consultations += summary.consultations;
      acc.solvedCount += summary.solvedCount;
      acc.transferCount += summary.transferCount;
      consultationCategories.forEach((category) => {
        const share = summary.categoryShare[category] ?? 0;
        acc.categoryShare[category] =
          (acc.categoryShare[category] ?? 0) +
          share * summary.consultations;
      });
      return acc;
    },
    {
      consultations: 0,
      solvedCount: 0,
      transferCount: 0,
      categoryShare: {} as Record<string, number>,
    },
  );

  const categoryShare = normalizeShare(totals.categoryShare);

  return {
    year,
    level: "national",
    consultations: totals.consultations,
    solvedCount: totals.solvedCount,
    transferCount: totals.transferCount,
    categoryShare,
  };
};

const nationalSummaries = [buildNationalSummary(2024), buildNationalSummary(2025)];

export const yearlySummaries: YearlySummary[] = [
  ...nationalSummaries,
  ...prefSummariesByYear[2024],
  ...prefSummariesByYear[2025],
];

export const getNationalYearlySummary = (year: number): YearlySummary =>
  nationalSummaries.find((summary) => summary.year === year)!;

export const getPrefYearlySummary = (
  prefCode: string,
  year: number,
): YearlySummary =>
  prefSummariesByYear[year].find(
    (summary) => summary.prefCode === prefCode,
  )!;

export const getPrefYearlySummaries = (prefCode: string): YearlySummary[] =>
  [2024, 2025].map((year) => getPrefYearlySummary(prefCode, year));



