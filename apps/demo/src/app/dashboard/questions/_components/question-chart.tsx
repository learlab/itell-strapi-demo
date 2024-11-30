"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@itell/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@itell/ui/chart";

const chartConfig = {
  value: {
    label: "Count",
  },
  poor: {
    label: "Poor",
    color: "hsl(var(--chart-2))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-3))",
  },
  excellent: {
    label: "Excellent",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type Props = {
  data: { name: string; value: number; fill: string }[];
};

export function QuestionChart({ data }: Props) {
  return (
    <>
      <p className="sr-only" id="question-chart-title">
        A bar chart of user&apos;s answers,{" "}
        {data.find((d) => d.name === "poor")?.value ?? 0} poor,{" "}
        {data.find((d) => d.name === "average")?.value ?? 0} average,{" "}
        {data.find((d) => d.name === "excellent")?.value ?? 0} excellent
      </p>
      <ChartContainer
        config={chartConfig}
        className="min-h-[100px] max-w-[600px]"
        aria-labelledby="question-chart-title"
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            right: 32,
          }}
        >
          <XAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <YAxis dataKey="value" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                descriptionKey="description"
              />
            }
          />
          <Bar dataKey="value" radius={5}>
            <LabelList
              dataKey="name"
              offset={8}
              className="fill-[--color-label] text-base font-light xl:text-lg"
              fontSize={12}
              formatter={(value: string) => {
                return chartConfig[value as keyof typeof chartConfig].label;
              }}
            />
            <LabelList
              dataKey="value"
              position="top"
              className="fill-foreground text-base xl:text-lg"
              offset={8}
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  );
}
