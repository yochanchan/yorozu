import Link from "next/link";

import { RoleSwitcher } from "@/app/yorozu-demo/components/RoleSwitcher";

const bullets = [
  "相談カルテの共通化",
  "類似成功事例の自動レコメンド",
  "他拠点・全国本部・他支援機関へのスムーズな取次",
  "全国・都道府県別のリアルタイム集計の可視化",
];

const roles = [
  {
    title: "拠点として見る",
    description:
      "相談対応中の入力画面と、類似事例レコメンド、取次の流れを確認できます。",
    href: "/yorozu-demo/branch",
    accent: "#2563eb",
  },
  {
    title: "全国本部として見る",
    description:
      "全国および都道府県別の相談状況を俯瞰するダッシュボードを確認できます。",
    href: "/yorozu-demo/hq",
    accent: "#0ea5e9",
  },
];

const DemoTopPage = () => (
  <div className="yorozu-grid gap-8">
    <section className="yorozu-hero grid gap-8 p-8 md:grid-cols-1">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
          デモ概要
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900">
          47都道府県を一元管理する相談カルテ・集計システムの将来像
        </h2>
        <p className="mt-3 text-md text-slate-600">
          Next.jsのみで構成されたプロトタイプ。架空モックデータを用い、2ロール（拠点 / 全国本部）
          を短時間で体験できます。
        </p>
        <ul className="mt-5 space-y-2 text-md text-slate-700">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <span className="mt-1 size-2 rounded-full bg-blue-600" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>デモ時間：2分想定</span>
          <span>ロール：拠点 / 全国本部</span>
          <Link
            href="/yorozu-demo/stories"
            className="font-semibold text-blue-700 underline-offset-2 hover:underline"
          >
            成功事例を先に確認する
          </Link>
        </div>
      </div>
    </section>
    <section>
      <p className="text-md font-semibold text-slate-600">ロール選択</p>
      <RoleSwitcher roles={roles} />
    </section>
  </div>
);

export default DemoTopPage;
