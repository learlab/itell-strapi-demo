"use client";

import {
	RadarChart as BaseRadarChart,
	PolarAngleAxis,
	PolarGrid,
	Radar,
} from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/client-components";
import { BadgeStats } from "@/lib/dashboard";
import { TrendingDown, TrendingUp } from "lucide-react";

const chartConfig = {
	user: {
		label: "user",
		color: "hsl(var(--chart-1))",
	},
	other: {
		label: "others",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

type Props = {
	userStats: BadgeStats;
	otherStats: BadgeStats;
	userProgress: number;
	otherProgress: number;
	otherCount: number;
};

export const RadarChart = ({
	userStats,
	otherStats,
	userProgress,
	otherProgress,
	otherCount,
}: Props) => {
	const data = [
		{
			label: "Progress",
			user: userProgress,
			other: otherProgress,
		},
		{
			label: "Total Summaries",
			user: userStats.totalCount,
			other: otherStats.totalCount / otherCount,
		},
		{
			label: "Passed Summaries",
			user: userStats.passedCount,
			other: otherStats.passedCount / otherCount,
		},
		{
			label: "Content Score",
			user: userStats.avgContentScore,
			other: otherStats.avgContentScore,
		},
		{
			label: "Language Score",
			user: userStats.avgLanguageScore,
			other: otherStats.avgLanguageScore,
		},

		{
			label: "Correct Answers",
			user: userStats.passedConstructedResponses,
			other: otherStats.passedConstructedResponses,
		},
	];

	return (
		<div className="flex items-center justify-center">
			<ChartContainer
				config={chartConfig}
				className="mx-auto max-w-2xl  min-h-[350px]"
			>
				<BaseRadarChart
					data={data}
					margin={{
						right: 60,
						left: 60,
					}}
				>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent indicator="line" />}
					/>
					<PolarGrid />
					<PolarAngleAxis
						dataKey="month"
						tick={({ x, y, textAnchor, value, index, ...props }) => {
							const d = data[index];
							const pct = Math.round(((d.user - d.other) / d.other) * 100);
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
										fill={
											pct < 0
												? "var(--color-user)"
												: pct > 0
													? "var(--color-other)"
													: "var(--color-muted-foreground)"
										}
									>{`${pct > 0 ? "+" : ""}${pct}%`}</tspan>
									<tspan
										x={x}
										dy={"1rem"}
										fontSize={12}
										className="fill-muted-foreground"
									>
										{d.label}
									</tspan>
								</text>
							);
						}}
					/>
					<Radar
						dataKey="user"
						fill="var(--color-user)"
						fillOpacity={0}
						stroke="var(--color-user)"
						strokeWidth={2}
					/>
					<Radar
						dataKey="other"
						fill="var(--color-other)"
						fillOpacity={0}
						stroke="var(--color-other)"
						strokeWidth={2}
					/>
					<ChartLegend className="mt-8" content={<ChartLegendContent />} />
				</BaseRadarChart>
			</ChartContainer>
		</div>
	);
};
