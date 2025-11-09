"use client";

import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const colors = ["#1d4ed8", "#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#64748b"];

type PieChartData = {
  name: string;
  value: number;
};

type SimplePieChartProps = {
  data: PieChartData[];
};

export const SimplePieChart = ({ data }: SimplePieChartProps) => (
  <div className="h-50 w-full">
    <ResponsiveContainer>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          innerRadius={1}
          label={({ name, value }) => `${name} ${value}%`}
          fontSize={15}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value}%`} />
      </RechartsPieChart>
    </ResponsiveContainer>
  </div>
);
