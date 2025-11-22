import { Mieru10Item, Mieru10Notes } from "@/lib/types";

export const mieru10Items: Mieru10Item[] = [
  {
    id: "concept",
    label: "コンセプト",
    description: "ターゲット・価格帯・店の特徴がA4 1枚で説明できる",
    advice:
      "主要ターゲットが誰なのか、利用シーンと価格帯を書面化し再確認しましょう。",
    threshold: 3,
  },
  {
    id: "money",
    label: "お金",
    description: "開業資金・月次収支・損益分岐点が数字で見えている",
    advice:
      "開業投資と3か月分の運転資金を含めたキャッシュフロー表を作成してください。",
    threshold: 3,
  },
  {
    id: "location",
    label: "立地",
    description: "候補物件の条件と周辺人口・競合状況を押さえている",
    advice:
      "物件契約前に1日の人流を2回以上確認し、競合の価格帯と比較してください。",
    threshold: 3,
  },
  {
    id: "layout",
    label: "内装・設備",
    description: "厨房レイアウトと席配置のドラフトがあり概算見積も取得済み",
    advice:
      "設計者とラフレイアウトを描き、動線チェックと設備容量の仮見積りを行いましょう。",
    threshold: 3,
  },
  {
    id: "legal",
    label: "許認可",
    description: "保健所・消防への事前相談が済み、必要書類を把握している",
    advice:
      "物件契約前の相談で厨房区画や自動火災報知設備の要否を確認するのが安全です。",
    threshold: 3,
  },
  {
    id: "menu",
    label: "メニュー",
    description: "主力メニューと仕入れ先、原価率の目安を整理できている",
    advice:
      "主要メニュー5品のレシピと原価を算出し、荒利率が確保できるか点検してください。",
    threshold: 3,
  },
  {
    id: "operation",
    label: "オペ",
    description: "人員配置とシフトパターン、業務フローを可視化できている",
    advice:
      "開店準備〜閉店までのタスク表を作り、必要人数と教育ステップを明確にしましょう。",
    threshold: 3,
  },
  {
    id: "promotion",
    label: "販促",
    description: "プレオープン・本番の販促計画とチャネルが具体化している",
    advice:
      "オープン前後 30 日の販促カレンダーを組み、SNS／PR／既存顧客の導線を設定してください。",
    threshold: 3,
  },
  {
    id: "accounting",
    label: "経理",
    description: "帳簿体制、税理士や会計ソフトの選定が済んでいる",
    advice:
      "会計ソフトと税理士の役割分担を決め、仕訳ルールと締め日を文書化しましょう。",
    threshold: 3,
  },
  {
    id: "risk",
    label: "リスク",
    description: "契約・保険・トラブル時の連絡先が整理できている",
    advice:
      "賃貸契約の特約やPL保険の加入条件を確認し、緊急連絡網を作成しておくと安心です。",
    threshold: 3,
  },
];

export const defaultMieru10Notes: Mieru10Notes = mieru10Items.reduce(
  (acc, item) => {
    acc[item.id] = "";
    return acc;
  },
  {} as Mieru10Notes,
);
