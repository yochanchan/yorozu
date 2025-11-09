import { RecommendationRule } from "@/lib/types";

export const recommendationRules: RecommendationRule[] = [
  {
    id: "rule-ec",
    match: {
      categories: ["販路開拓", "IT知識全般"],
    },
    suggestStoryIds: ["story-ec-01", "story-finance-01"],
    label: "デジタル販路開拓の先進事例",
  },
  {
    id: "rule-succession",
    match: {
      categories: ["事業承継"],
    },
    suggestStoryIds: ["story-succession-01"],
    label: "承継伴走の好例",
  },
  {
    id: "rule-startup",
    match: {
      categories: ["創業"],
    },
    suggestStoryIds: ["story-startup-01"],
    label: "創業・DXサポート",
  },
  {
    id: "rule-finance",
    match: {
      categories: ["資金繰り"],
    },
    suggestStoryIds: ["story-finance-01"],
    label: "資金繰り＋サプライチェーン連携",
  },
];
