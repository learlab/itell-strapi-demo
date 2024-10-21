"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@itell/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList } from "recharts";

import type { ChartConfig } from "@itell/ui/chart";

const chartConfig = {
  value: {
    label: "Reading Time",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  data: { name: string; value: number }[];
};

export function ReadingTimeChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 32,
        }}
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="line" />}
          labelClassName="mr-1"
          formatter={(value: number) => `${String(Math.round(value))} minutes`}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={8}>
          <LabelList
            dataKey="name"
            position="insideBottom"
            offset={8}
            className="fill-[--color-label] text-sm xl:text-base"
            fontSize={12}
          />
          <LabelList
            dataKey="value"
            position="top"
            offset={8}
            className="fill-foreground text-base xl:text-lg"
            fontSize={12}
            formatter={(value: number) => {
              if (Math.round(value) === 0) return "";
              return `${String(Math.round(value))} minutes`;
            }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
