"use client";

import { useMemo, useState } from "react";

const candidates = [
  { name: "全国本部 連携窓口", expertise: "全国連携・制度調整", count: 42 },
  { name: "北海道ブロック連絡会", expertise: "観光・一次産業", count: 28 },
  { name: "IT専門チーム", expertise: "DX・EC", count: 35 },
  { name: "金融機関連携窓口", expertise: "資金繰り・保証", count: 31 },
];

type TransferPayload = {
  type: "他拠点" | "全国本部" | "他支援機関";
  target: string;
  memo: string;
};

type TransferModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TransferPayload) => void;
};

export const TransferModal = ({
  open,
  onClose,
  onSubmit,
}: TransferModalProps) => {
  const [type, setType] = useState<TransferPayload["type"]>("全国本部");
  const [target, setTarget] = useState(candidates[0].name);
  const [memo, setMemo] = useState("");

  const filteredCandidates = useMemo(() => candidates, []);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit({ type, target, memo });
    setMemo("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
              取次デモ
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              他拠点・本部・他機関連携
            </h3>
          </div>
          <button
            className="text-sm text-slate-500 hover:text-slate-900"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-slate-600">
            取次種別
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as TransferPayload["type"])
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="他拠点">他拠点</option>
              <option value="全国本部">全国本部</option>
              <option value="他支援機関">他支援機関</option>
            </select>
          </label>
          <div>
            <p className="text-sm font-semibold text-slate-600">候補一覧</p>
            <div className="mt-2 grid gap-2">
              {filteredCandidates.map((candidate) => (
                <label
                  key={candidate.name}
                  className="flex cursor-pointer justify-between rounded-xl border px-4 py-3 hover:border-blue-400"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {candidate.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      得意分野: {candidate.expertise}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      対応中 {candidate.count}件
                    </span>
                    <input
                      type="radio"
                      name="transfer-target"
                      checked={target === candidate.name}
                      onChange={() => setTarget(candidate.name)}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
          <label className="text-sm font-semibold text-slate-600">
            任意コメント
            <textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="共有したい背景や期待する支援内容などを記載できます。"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            取次を送信（デモ）
          </button>
        </div>
      </div>
    </div>
  );
};
