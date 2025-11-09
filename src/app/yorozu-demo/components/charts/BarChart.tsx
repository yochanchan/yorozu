"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SimpleBarChartData = {
  [key: string]: string | number;
  consultations: number;
};

type SimpleBarChartProps = {
  data: SimpleBarChartData[];
  labelKey?: string;
  height?: number;
  xTickAngle?: number;
};

export const SimpleBarChart = ({
  data,
  labelKey = "monthLabel",
  height = 288,
  xTickAngle = 0,
}: SimpleBarChartProps) => (
  <div className="w-full" style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={labelKey}
          angle={xTickAngle}
          textAnchor={xTickAngle ? "end" : "middle"}
          interval={0}
          height={xTickAngle ? 90 : undefined}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="consultations" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  </div>
);
