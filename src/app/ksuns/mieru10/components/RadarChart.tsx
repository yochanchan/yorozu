"use client";

import { useId } from "react";

import { Mieru10Item, Mieru10Scores } from "@/lib/types";

type RadarChartProps = {
  items: Mieru10Item[];
  scores: Mieru10Scores;
  threshold: number;
};

const TOTAL_LEVELS = 5;

export const RadarChart = ({ items, scores, threshold }: RadarChartProps) => {
  const size = 420;
  const center = size / 2;
  const radius = 170;

  const uuid = useId();
  const clipId = `mieru10-polygon-${uuid}`;
  const maskId = `mieru10-highlight-${uuid}`;

  const angles = items.map(
    (_, index) => (Math.PI * 2 * index) / items.length - Math.PI / 2,
  );

  const getPoint = (value: number, angle: number) => {
    const ratio = value / TOTAL_LEVELS;
    const x = center + Math.cos(angle) * radius * ratio;
    const y = center + Math.sin(angle) * radius * ratio;
    return { x, y };
  };

  const axisPoints = angles.map((angle) => getPoint(TOTAL_LEVELS, angle));

  const polygonPoints = items
    .map((item, index) => {
      const score = scores[item.id] ?? 0;
      const { x, y } = getPoint(score, angles[index]);
      return `${x},${y}`;
    })
    .join(" ");

  const meetsThreshold = items.every(
    (item) => (scores[item.id] ?? 0) >= threshold,
  );
  const fillColor = meetsThreshold
    ? "rgba(16, 185, 129, 0.35)"
    : "rgba(249, 115, 22, 0.35)";
  const strokeColor = meetsThreshold ? "#0d9488" : "#ea580c";
  const highlightColor = meetsThreshold
    ? "rgba(5, 150, 105, 0.45)"
    : "rgba(234, 88, 12, 0.55)";

  const thresholdRadius = (threshold / TOTAL_LEVELS) * radius;

  const levelPolygons = Array.from({ length: TOTAL_LEVELS }, (_, levelIndex) => {
    const level = levelIndex + 1;
    const points = angles
      .map((angle) => {
        const { x, y } = getPoint(level, angle);
        return `${x},${y}`;
      })
      .join(" ");
    return { level, points };
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            10角形レーダーチャート
          </p>
          <p className="text-sm text-slate-500">
            合格ラインはスコア 3（点線）。弱点は赤いポイントで表示します。
          </p>
        </div>
        <div className="text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" /> 開業OK
            <span className="size-2 rounded-full bg-orange-500" /> 要検討
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-lg justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width="100%"
          height="100%"
          role="img"
          aria-label="10項目セルフチェックの結果を示すレーダーチャート"
        >
          <defs>
            <clipPath id={clipId}>
              <polygon points={polygonPoints} />
            </clipPath>
            <mask id={maskId}>
              <rect width={size} height={size} fill="white" />
              <circle cx={center} cy={center} r={thresholdRadius} fill="black" />
            </mask>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="fill-transparent stroke-slate-200"
            strokeWidth={1}
          />
          {levelPolygons.map(({ level, points }) => (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={level === threshold ? 1.5 : 1}
              strokeDasharray={level === threshold ? "5 5" : undefined}
            />
          ))}
          {axisPoints.map((point, index) => (
            <line
              key={`axis-${items[index].id}`}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#cbd5f5"
              strokeWidth={1}
            />
          ))}
          {polygonPoints && (
            <>
              <polygon
                points={polygonPoints}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={2}
              />
              <rect
                width={size}
                height={size}
                fill={highlightColor}
                clipPath={`url(#${clipId})`}
                mask={`url(#${maskId})`}
              />
            </>
          )}
          {items.map((item, index) => {
            const score = scores[item.id] ?? 0;
            const { x, y } = getPoint(score, angles[index]);
            const needsAttention = score <= 2;
            return (
              <g key={`point-${item.id}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={needsAttention ? 5 : 4}
                  fill={needsAttention ? "#ef4444" : strokeColor}
                  stroke="#fff"
                  strokeWidth={2}
                />
              </g>
            );
          })}
          {items.map((item, index) => {
            const angle = angles[index];
            const labelRadius = radius + 30;
            const labelX = center + Math.cos(angle) * labelRadius;
            const labelY = center + Math.sin(angle) * labelRadius;
            const score = scores[item.id] ?? 0;
            const anchor: "middle" | "start" | "end" =
              Math.abs(Math.cos(angle)) < 0.2
                ? "middle"
                : Math.cos(angle) > 0
                  ? "start"
                  : "end";
            const baseline: "middle" | "hanging" | "baseline" =
              Math.abs(Math.sin(angle)) < 0.2
                ? "middle"
                : Math.sin(angle) > 0
                  ? "hanging"
                  : "baseline";
            return (
              <text
                key={`label-${item.id}`}
                x={labelX}
                y={labelY}
                textAnchor={anchor}
                dominantBaseline={baseline}
                className={`text-sm font-semibold ${
                  score < threshold ? "fill-red-500" : "fill-slate-700"
                }`}
              >
                {item.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
