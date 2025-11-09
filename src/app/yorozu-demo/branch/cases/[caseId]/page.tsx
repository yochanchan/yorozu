import Link from "next/link";
import { notFound } from "next/navigation";

import { getCaseById } from "@/lib/mockData/pastCases";
import { getPrefectureName } from "@/lib/utils/prefecture";

type CaseDetailPageProps = {
  params: { caseId: string };
};

const CaseDetailPage = ({ params }: CaseDetailPageProps) => {
  const record = getCaseById(params.caseId);
  if (!record) {
    notFound();
  }

  return (
    <div className="yorozu-card space-y-6 rounded-2xl border px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
            参考カルテ
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {getPrefectureName(record.prefCode)} 相談カルテ
          </h1>
          <p className="text-sm text-slate-500">
            相談ID: {record.id} / ステータス: {record.status}
          </p>
        </div>
        <Link
          href="/yorozu-demo/branch"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          拠点画面に戻る
        </Link>
      </div>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">相談日</p>
          <p className="text-lg font-semibold text-slate-900">{record.date}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">担当コーディネーター</p>
          <p className="text-lg font-semibold text-slate-900">
            {record.coordinator}
          </p>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900">事業者情報</h2>
        <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">業種</dt>
            <dd className="font-medium text-slate-900">
              {record.clientProfile.industry}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">従業員数</dt>
            <dd>{record.clientProfile.employees}人</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">売上規模</dt>
            <dd>{record.clientProfile.sales}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">創業年数</dt>
            <dd>{record.clientProfile.yearsInBusiness}</dd>
          </div>
        </dl>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">相談概要</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {record.summary}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">支援内容</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {record.supportPlan}
          </p>
        </article>
      </section>
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">相談類型</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-blue-700">
          {record.categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-blue-50 px-3 py-1"
            >
              {category}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CaseDetailPage;
