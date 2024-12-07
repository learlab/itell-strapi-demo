"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@itell/ui/chart";
import { CheckIcon, XIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import type { ChartConfig } from "@itell/ui/chart";

const chartConfig = {
  passed: {
    label: "Passed",
    icon: CheckIcon,
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed",
    icon: XIcon,
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type Props = {
  data: { name: string; value: number; fill: string }[];
  totalCount: number;
  startDate: string;
  endDate: string;
  chartTitle?: string;
};

export function SummaryChart({
  data,
  totalCount,
  startDate,
  endDate,
  chartTitle = "Summary Submission History",
}: Props) {
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>
          {startDate}- {endDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="sr-only" id="summary-chart-title">
          A pie chart of user&apos;s summaries,{" "}
          {data.find((d) => d.name === "passed")?.value} passed,{" "}
          {data.find((d) => d.name === "failed")?.value} failed
        </p>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
          aria-labelledby="summary-chart-title"
        >
          <PieChart margin={{ left: 60, right: 60 }} accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              nameKey="name"
              dataKey="value"
              labelLine={false}
              strokeWidth={5}
              label={({ payload, ...props }) => {
                if (payload.value === 0) {
                  return;
                }

                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                    offset={8}
                  >
                    {`${
                      chartConfig[payload.name as keyof typeof chartConfig]
                        .label
                    } (${payload.value})`}
                  </text>
                );
              }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          summaries
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
