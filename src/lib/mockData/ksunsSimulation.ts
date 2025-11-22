import {
  FoodMainCategory,
  KsunsFormData,
  KsunsSimulationInput,
  KsunsSimulationResult,
} from "@/lib/types";

const conceptSeeds: Record<
  FoodMainCategory,
  {
    concept: string;
    target: string;
    keywords: string[];
    menuIdeas: string[];
    marketing: string[];
    operations: string[];
  }
> = {
  和食: {
    concept: "出汁と季節の小皿で日常を整える和食サロン",
    target: "30〜50代の共働きファミリー／仕事帰りの単身層",
    keywords: ["出汁", "季節替わり", "和モダン"],
    menuIdeas: ["季節三彩御膳", "骨まで柔らかい煮魚", "柚子香る炊き込みご飯"],
    marketing: ["地域の和菓子店と連動した季節イベント", "Instagram の仕込みライブ配信"],
    operations: ["出汁と煮込みは火入れ時間を揃えて仕込み効率を最適化", "セミセルフ会計で回転率を維持"],
  },
  洋食: {
    concept: "クラシック洋食を小皿で楽しむネオダイナー",
    target: "20〜40代の女子会／オフィス街ランチ層",
    keywords: ["洋食酒場", "小皿", "ライブキッチン"],
    menuIdeas: ["焦がしバターオムライス", "赤ワイン煮込みハンバーグ", "季節野菜のグラタン"],
    marketing: ["TikTok での断面動画", "平日ランチの予約導線を LINE に集約"],
    operations: ["グリドルとコンベクションを活用し、ピーク火力を平準化", "ペア席を多めに配置し、稼働率を最大化"],
  },
  中華: {
    concept: "蒸籠と鉄鍋で温度帯を操るライブ中華食堂",
    target: "近隣オフィスのグループ利用＋夜のファミリー",
    keywords: ["ライブ感", "点心", "ペアリング"],
    menuIdeas: ["花椒香る麻婆豆腐", "蒸し立て小籠包", "黒酢酢豚"],
    marketing: ["テイクアウト餃子のサブスク", "本場シェフの仕込み配信"],
    operations: ["二鍋制と蒸しラインのダブル構成でピークを吸収", "オープンキッチンで導線を可視化し教育を早める"],
  },
  "アジア・エスニック": {
    concept: "ハーブとスパイスで旅気分をつくるトロピカルダイナー",
    target: "感度の高い20代〜30代／リモートワーカーの軽食需要",
    keywords: ["スパイス", "グルテンフリー", "グラフィック"],
    menuIdeas: ["ガパオ玄米プレート", "バインミー", "バタフライピーソーダ"],
    marketing: ["季節の南国フルーツとのコラボ", "Spotify プレイリストと連動した空間演出"],
    operations: ["セントラルキッチン的なソース仕込みで人依存を減らす", "辛さレンジを3段階に統一し提供リズムを一定化"],
  },
  "カフェ・スイーツ": {
    concept: "喫茶文化を再編集した滞在型カフェ",
    target: "日中のノマド／週末の親子利用",
    keywords: ["サードプレイス", "ハンドドリップ", "アナログレコード"],
    menuIdeas: ["季節の仕立てパフェ", "3種のブレンドコーヒー", "焼き立てスコーン"],
    marketing: ["サブスク制の豆配送", "SNS でのライブ焙煎配信"],
    operations: ["客席導線を広く確保し長時間滞在にも耐える", "キッチンはコンパクト＋コンベクションで効率化"],
  },
  "バー・酒場": {
    concept: "クラフトドリンクと発酵おつまみのモダン酒場",
    target: "30〜40代のナイトライフ層／近隣の飲食従事者",
    keywords: ["発酵", "クラフト", "夜景"],
    menuIdeas: ["樽生クラフトビール", "燻製ポテサラ", "スパイスラムサワー"],
    marketing: ["夜景を使ったリール動画", "会員制テーブル予約"],
    operations: ["カウンター集中配置でスタッフ導線を短縮", "ペアリングチャートで教育を省力化"],
  },
  "ラーメン・麺": {
    concept: "熟成スープと自家製麺を 6 分で届ける麺スタンド",
    target: "昼のビジネス層／夜のシメ需要",
    keywords: ["自家製麺", "限定トッピング", "高速回転"],
    menuIdeas: ["熟成醤油ラーメン", "魚介豚骨つけ麺", "シビ辛担々麺"],
    marketing: ["限定麺を X で先行発表", "モバイルオーダー連動整理券"],
    operations: ["スープ 2 種＋つけだれ 1 種の構成で火口を最適化", "食券レスの QR オーダーで回転を維持"],
  },
  "焼肉・焼き鳥・肉": {
    concept: "赤身を主役にした体験型ロースト＆炭焼きラウンジ",
    target: "30〜50代の会食／週末ファミリー",
    keywords: ["赤身", "炭火", "ライブ解体"],
    menuIdeas: ["厚切り牛タン", "低温調理ハラミ", "炭焼き大山どり"],
    marketing: ["ライブ解体ショーの配信", "サブスク会員限定の部位予約"],
    operations: ["排煙ダクトとカウンター炭床を一体設計", "肉の熟成スケジュールをガントチャート化"],
  },
  "ファストフード・軽食": {
    concept: "ローカル食材でつくるクラフト軽食スタンド",
    target: "学生・若年層／イベント集客",
    keywords: ["クラフト", "テイクアウト", "スピード"],
    menuIdeas: ["クラフトバーガー", "スパイスチキン", "季節シェイク"],
    marketing: ["近隣イベントとのセット券", "アプリスタンプで回数券を提供"],
    operations: ["ラインをホット／コールドの 2 系統に分けて同時進行", "仕込み冷蔵庫のゾーニングで食材ロスを最小化"],
  },
  "ベーカリー・惣菜": {
    concept: "朝の街を彩る発酵ラボ＆惣菜デリ",
    target: "子育て世帯／朝活層",
    keywords: ["発酵", "焼きたて", "デリ"],
    menuIdeas: ["バター香るクロワッサン", "旬野菜キッシュ", "スパイス惣菜セット"],
    marketing: ["焼き上がり時間をプッシュ通知", "近隣コワーキングと朝食コラボ"],
    operations: ["深夜仕込みのシフト分散で人件費を平準化", "ショーケース動線を回遊式にして単価を上げる"],
  },
  キッチンカー: {
    concept: "都市を巡るマイクロ屋台ラボ",
    target: "イベント参加者／平日のビジネス街ランチ",
    keywords: ["モバイル", "二毛作", "季節メニュー"],
    menuIdeas: ["スパイスカレーBOX", "クラフトレモネード", "プラントベースタコス"],
    marketing: ["出店予定を LINE で告知", "SNS の位置情報投稿で認知拡大"],
    operations: ["積載量を 3 ブロックで管理し補充を自動化", "仕込み拠点との連携表を共有"],
  },
  その他: {
    concept: "多用途イベントに即応するマルチユースキッチン",
    target: "エリアのクリエイター／地域イベント主催者",
    keywords: ["ポップアップ", "シェアキッチン", "プラットフォーム"],
    menuIdeas: ["テーマ別ポップアップコース", "クラフトドリンクペアリング", "地域コラボメニュー"],
    marketing: ["出店者ストーリーを note で連載", "来場者のメルマガ化でリピート動線"],
    operations: ["ユニット什器で 1 日単位の転換を可能に", "POS 設定をテンプレ化して引継ぎを簡易化"],
  },
};

const locationBoost: Record<KsunsFormData["locationProfile"], number> = {
  駅チカ: 1,
  住宅街: 0.85,
  オフィス街: 0.95,
  観光地: 1.1,
  郊外: 0.75,
};

const calcGuestsPerDay = (
  seats: number,
  slotCount: number,
  locationProfile: KsunsFormData["locationProfile"],
) => {
  const baseTurnover = 0.9 + slotCount * 0.6;
  const turnover = Math.min(3.2, baseTurnover);
  const occupancy = 0.6 + locationBoost[locationProfile] * 0.2;
  return Math.round(seats * turnover * occupancy);
};

const calcFinance = (
  revenue: number,
  seats: number,
  mainCategory: FoodMainCategory,
): {
  initialCost: number;
  workingCapital: number;
  monthlyCost: number;
  breakEvenMonths: number;
} => {
  const baseInitial = 8_000_000;
  const seatWeight = seats * 120_000;
  const categoryPremium =
    mainCategory === "焼肉・焼き鳥・肉" || mainCategory === "バー・酒場"
      ? 1.4
      : mainCategory === "キッチンカー"
        ? 0.5
        : 1;
  const initialCost = Math.round(baseInitial * categoryPremium + seatWeight);
  const workingCapital = Math.round(revenue * 0.25);
  const monthlyCost = Math.round(revenue * 0.62);
  const monthlyProfit = revenue - monthlyCost;
  const breakEvenMonths = Math.max(
    6,
    Math.round(initialCost / Math.max(monthlyProfit, 1)),
  );
  return { initialCost, workingCapital, monthlyCost, breakEvenMonths };
};

export const simulateKsunsResult = (
  input: KsunsSimulationInput,
): KsunsSimulationResult => {
  const { mainCategory, subCategory, form } = input;
  const seats = typeof form.seats === "number" ? form.seats : 24;
  const unitPrice = typeof form.unitPrice === "number" ? form.unitPrice : 2800;
  const slotCount = Math.max(form.timeSlots.length, 1);
  const guestsPerDay = calcGuestsPerDay(seats, slotCount, form.locationProfile);
  const monthlyRevenue = Math.round(guestsPerDay * unitPrice * 30);

  const base = conceptSeeds[mainCategory];
  const finance = calcFinance(monthlyRevenue, seats, mainCategory);
  const monthlyProfit = monthlyRevenue - finance.monthlyCost;

  return {
    concept: {
      title: `「${subCategory || mainCategory}」の仮コンセプト`,
      summary: base.concept,
      target: base.target,
      keywords: base.keywords,
    },
    kpis: [
      {
        label: "1日客数",
        value: `${guestsPerDay}名`,
        description: "席数 × 回転率 × 稼働率で算出した概算値",
      },
      {
        label: "平均客単価",
        value: `${unitPrice.toLocaleString()}円`,
        description: "入力値をそのまま KP I として使用",
      },
      {
        label: "月間売上予測",
        value: `${monthlyRevenue.toLocaleString()}円`,
        description: "客数 × 客単価 × 営業日数（30日）",
      },
      {
        label: "座席稼働率",
        value: `${(Math.min(1, guestsPerDay / (seats * slotCount)) * 100).toFixed(0)}%`,
        description: "1日あたりの稼働率イメージ",
      },
    ],
    menuExamples: base.menuIdeas.map((name) => ({
      name,
      description: `${name}を軸に、季節素材やローカル食材で差別化します。`,
    })),
    marketing: base.marketing.map((detail, index) => ({
      title: `集客戦略 ${index + 1}`,
      detail,
    })),
    operations: base.operations.map((detail, index) => ({
      title: `オペレーション戦略 ${index + 1}`,
      detail,
    })),
    finance: {
      initialCost: finance.initialCost,
      workingCapital: finance.workingCapital,
      monthlyRevenue,
      monthlyCost: finance.monthlyCost,
      monthlyProfit,
      breakEvenMonths: finance.breakEvenMonths,
      fundingTips:
        "日本政策金融公庫の開業融資や、自治体の創業補助金との併用を推奨。",
    },
    cta: {
      title: "詳細シミュレーションで数値を固める",
      description:
        "席配置や日別売上をさらに細かく比較するには、ユーザー登録が必要です。",
      actionLabel: "無料登録して詳細を試す",
      actionHref: "/register",
    },
  };
};
