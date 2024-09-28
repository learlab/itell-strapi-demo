"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@itell/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

type Props = {
  label: string;
  current: number | null;
  prev: number | null;
};

export function TrendChart({ label, prev, current }: Props) {
  const chartConfig = {
    value: {
      label,
      color:
        current && prev
          ? current - prev > 0
            ? "hsl(var(--chart-2))"
            : "hsl(var(--chart-1))"
          : "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  const chartData = [
    { name: "Last Week", value: prev },
    { name: "Now", value: current },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-full w-14">
      <LineChart accessibilityLayer data={chartData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
        <Line
          dataKey="value"
          type="linear"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot
        />
        <YAxis
          domain={["dataMin", "dataMax"]}
          tickLine={false}
          axisLine={false}
          hide
        />
      </LineChart>
    </ChartContainer>
  );
}
