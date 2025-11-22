"use client";

type HeroSectionProps = {
  onStart: () => void;
};

const steps = [
  { label: "① ホーム", description: "目的を把握してゴールを明確化" },
  { label: "② メインジャンル", description: "12 カテゴリから選択" },
  { label: "③ サブジャンル", description: "より詳細な業態を決定" },
  { label: "④ 入力フォーム", description: "店舗条件と KPI 前提を入力" },
  { label: "⑤ 結果表示", description: "AI が仮コンセプトと KPI を提示" },
];

export const HeroSection = ({ onStart }: HeroSectionProps) => (
  <section className="yorozu-card flex flex-col gap-6 rounded-3xl border px-6 py-8 md:flex-row md:items-center md:justify-between">
    <div className="max-w-2xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
        KSUNS PREVIEW
      </p>
      <h1 className="text-3xl font-bold text-slate-900">
        飲食ジャンル × 条件入力で AI が仮コンセプトを構築
      </h1>
      <p className="text-base text-slate-600">
        「KSUNS」は、仮コンセプト生成・KPI 提示・投資目安を 5 ステップで可視化する体験版です。
        シミュレーションを通じて、ユーザー登録後の詳細分析にも自然に誘導します。
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          簡易シミュレーションをはじめる
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ログイン
        </button>
      </div>
    </div>
    <ol className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600 md:max-w-sm">
      {steps.map((step) => (
        <li
          key={step.label}
          className="flex items-start gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"
        >
          <span className="rounded-full bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-700">
            {step.label}
          </span>
          <span className="leading-relaxed">{step.description}</span>
        </li>
      ))}
    </ol>
  </section>
);
