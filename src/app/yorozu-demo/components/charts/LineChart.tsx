"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartDatum = {
  monthLabel: string;
  [series: string]: number | string;
};

type SimpleLineChartProps = {
  data: ChartDatum[];
  keys: string[];
};

export const SimpleLineChart = ({ data, keys }: SimpleLineChartProps) => {
  const seriesColors = ["#1d4ed8", "#f97316", "#22c55e"];
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={seriesColors[index % seriesColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
