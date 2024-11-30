"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@itell/ui/chart";
import { isNil } from "es-toolkit/predicate";
import {
  RadarChart as BaseRadarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
} from "recharts";

import { type OtherStats, type UserStats } from "@/actions/dashboard";
import type { ChartConfig } from "@itell/ui/chart";

const chartConfig = {
  userScaled: {
    label: "user",
    color: "hsl(var(--chart-1))",
  },
  otherScaled: {
    label: "other",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type DataItem = {
  label: string;
  user: number | null;
  other: number | null;
  userScaled: number;
  otherScaled: number;
  description: string;
};

type Props = {
  data: Record<
    | "progress"
    | "totalSummaries"
    | "passedSummaries"
    | "contentScore"
    | "correctCriAnswers",
    DataItem
  >;
};

export function UserRadarChart({ data }: Props) {
  const chartData = Object.entries(data).map(([key, value]) => value);
  return (
    <>
      <div className="sr-only" id="radar-chart-title">
        <h3>
          Radar Chart: user is{" "}
          <span>{data.progress.userScaled > 1 ? "ahead of" : "behind"}</span>{" "}
          median reading progress
        </h3>
      </div>

      <div className="sr-only" id="radar-chart-description">
        <p>
          This radar chart compares the user&apos;s statistics across several
          categories with the median of other users. Key observations are the
          following:
        </p>
        <ul>
          <li>
            User completed {data.progress.user} pages, median is{" "}
            {data.progress.other}, user is{" "}
            {data.progress.userScaled > 1 ? "ahead of" : "behind"} the median.
          </li>
          <li>
            User submitted {data.totalSummaries.user} summaries, median is{" "}
            {Math.round(data.totalSummaries.other ?? 0)}, user is{" "}
            {data.totalSummaries.userScaled > 1 ? "ahead of" : "behind"} the
            median.
          </li>
          <li>
            User passed {data.totalSummaries.user} summaries, median is{" "}
            {Math.round(data.totalSummaries.other ?? 0)}, user is{" "}
            {data.totalSummaries.userScaled > 1 ? "ahead of" : "behind"} the
            median.
          </li>
          <li>
            User scored {data.contentScore.user} in summary quality, median is{" "}
            {data.contentScore.other
              ? Math.round(data.contentScore.other)
              : "NA"}
            , user is {data.contentScore.userScaled > 1 ? "ahead of" : "behind"}{" "}
            the median.
          </li>
          <li>
            User had {data.correctCriAnswers.user} correct answer to questions,
            median is {Math.round(data.correctCriAnswers.other || 0)}, user is{" "}
            {data.correctCriAnswers.userScaled > 1 ? "ahead of" : "behind"} the
            median.
          </li>
        </ul>
      </div>

      <ChartContainer
        config={chartConfig}
        aria-labelledby="radar-chart-title"
        aria-describedby="radar-chart-description"
      >
        <BaseRadarChart
          data={chartData}
          margin={{
            right: 60,
            left: 60,
          }}
          accessibilityLayer
        >
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                descriptionKey="description"
                className="xl:text-base"
                valueFn={(item) => {
                  if (item.dataKey === "userScaled") {
                    return isNil(item.payload.user) ? "NA" : item.payload.user;
                  }

                  if (item.dataKey === "otherScaled") {
                    return isNil(item.payload.other)
                      ? "NA"
                      : item.payload.other;
                  }
                }}
              />
            }
          />
          <PolarGrid />
          <PolarAngleAxis
            dataKey="label"
            tick={({ x, y, textAnchor, index, ...props }) => {
              const d = chartData[index];
              const label = getComparisonText(d.user, d.other);
              return (
                <text
                  x={x}
                  y={index === 0 ? y - 10 : y}
                  textAnchor={textAnchor}
                  fontSize={13}
                  fontWeight={500}
                  {...props}
                >
                  <tspan
                    className="lg:text-sm"
                    fill={
                      label === "NA" || label === "Same" || label === 0
                        ? "var(--color-muted-foreground)"
                        : (typeof label === "number" && label > 0) ||
                            label === "Ahead"
                          ? "var(--color-otherScaled)"
                          : "var(--color-userScaled)"
                    }
                  >
                    {label}
                    {typeof label === "number" ? "%" : ""}
                  </tspan>
                  <tspan
                    x={x}
                    dy="1rem"
                    fontSize={12}
                    className="fill-muted-foreground lg:text-sm"
                  >
                    {d.label}
                  </tspan>
                </text>
              );
            }}
          />
          <Radar
            dataKey="userScaled"
            fillOpacity={0}
            stroke="var(--color-userScaled)"
            strokeWidth={2}
          />
          <Radar
            dataKey="otherScaled"
            fillOpacity={0}
            stroke="var(--color-otherScaled)"
            strokeWidth={2}
          />
          <ChartLegend className="mt-8" content={<ChartLegendContent />} />
        </BaseRadarChart>
      </ChartContainer>
    </>
  );
}

const getComparisonText = (user: number | null, other: number | null) => {
  const pct = user && other ? getRelativePct(user, other) : undefined;
  if (pct !== undefined) {
    return pct;
  }

  if (isNil(user)) {
    return "NA";
  }

  if (other === 0) {
    return user === 0 ? "Same" : user > 0 ? "Ahead" : "Behind";
  }

  return "NA";
};

const getRelativePct = (a: number, b: number) => {
  if (b === 0) {
    return undefined;
  }

  return Math.round(((a - b) / Math.abs(b)) * 100);
};

const scale = (a: number, b: number) => {
  if (Math.abs(b) < Number.EPSILON) {
    return a === 0 ? 0 : 2;
  }

  return a / Math.abs(b);
};
