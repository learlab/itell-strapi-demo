"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@itell/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import type { ChartConfig } from "@itell/ui/chart";

const chartConfig = {
  count: {
    label: "Number of students",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  data: { range: string; count: number }[];
};

export function ProgressChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 32 }}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="line" />}
          labelClassName="mr-1"
          formatter={(value: number, _, item) => {
            return `${value} students completed ${item.payload.range} pages`;
          }}
        />
        <XAxis
          dataKey="range"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value} pages`}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={8}>
          <LabelList
            dataKey="count"
            position="top"
            offset={8}
            className="fill-foreground text-base xl:text-lg"
            fontSize={12}
            formatter={(value: number) => {
              if (Math.round(value) === 0) return "";
              return `${String(Math.round(value))} students`;
            }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
