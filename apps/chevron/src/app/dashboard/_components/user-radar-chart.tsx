"use client";

import {
	RadarChart as BaseRadarChart,
	PolarAngleAxis,
	PolarGrid,
	Radar,
} from "recharts";

import { OtherStats, UserStats } from "@/lib/dashboard";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@itell/ui/client";

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

type Props = {
	userStats: UserStats;
	otherStats: OtherStats;
	userProgress: number;
	otherProgress: number;
};

export const UserRadarChart = ({
	userStats,
	otherStats,
	userProgress,
	otherProgress,
}: Props) => {
	const data = [
		{
			label: "Progress",
			user: userProgress,
			other: otherProgress,
			userScaled: scale(userProgress, otherProgress),
			otherScaled: 1,
			description: "Number of pages unlocked",
		},
		{
			label: "Total Summaries",
			user: userStats.totalSummaries,
			other: otherStats.totalSummaries,
			userScaled: scale(userStats.totalSummaries, otherStats.totalSummaries),
			otherScaled: 1,
			description: "Total number of summaries submitted",
		},
		{
			label: "Passed Summaries",
			user: userStats.totalPassedSummaries,
			other: otherStats.totalPassedSummaries,
			userScaled: scale(
				userStats.totalPassedSummaries,
				otherStats.totalPassedSummaries,
			),
			otherScaled: 1,
			description:
				"Total number of summaries that scored well in both content score and language score",
		},
		{
			label: "Content Score",
			user: userStats.contentScore,
			other: otherStats.contentScore,
			userScaled:
				userStats.contentScore && otherStats.contentScore
					? scale(userStats.contentScore, otherStats.contentScore)
					: undefined,
			otherScaled: 1,
			description:
				"Measures the semantic similarity between the summary and the original text. The higher the score, the better the summary describes the main points of the text.",
		},
		{
			label: "Language Score",
			user: userStats.languageScore,
			other: otherStats.languageScore,
			userScaled:
				userStats.languageScore && otherStats.languageScore
					? scale(userStats.languageScore, otherStats.languageScore)
					: undefined,
			otherScaled: 1,
			description:
				"Measures the language quality of the summary. The higher the score, the better the summary wording.",
		},

		{
			label: "Correct Answers",
			user: userStats.totalPassedAnswers,
			other: otherStats.totalPassedAnswers,
			userScaled: scale(
				userStats.totalPassedAnswers,
				otherStats.totalPassedAnswers,
			),
			otherScaled: 1,
			description: "Total number of questions answered during reading.",
		},
	];

	return (
		<div className="flex items-center justify-center">
			<ChartContainer
				config={chartConfig}
				className="mx-auto max-w-2xl min-h-[350px]"
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
						content={
							<ChartTooltipContent
								indicator="line"
								descriptionKey="description"
								valueFn={(item) => {
									if (item.dataKey === "userScaled") {
										return item.payload.user;
									}

									if (item.dataKey === "otherScaled") {
										return item.payload.other;
									}
								}}
							/>
						}
					/>
					<PolarGrid />
					<PolarAngleAxis
						dataKey="label"
						tick={({ x, y, textAnchor, value, index, ...props }) => {
							const d = data[index];
							const pct =
								d.user && d.other ? getRelativePct(d.user, d.other) : undefined;
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
											!pct || pct === 0
												? "var(--color-muted-foreground)"
												: pct > 0
													? "var(--color-otherScaled)"
													: "var(--color-userScaled)"
										}
									>{`${pct && pct > 0 ? "+" : ""}${
										pct !== undefined ? pct : "NA"
									}${pct !== undefined ? "%" : ""}`}</tspan>
									<tspan
										x={x}
										dy={"1rem"}
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
		</div>
	);
};

const getRelativePct = (a: number, b: number) => {
	if (b === 0) {
		return undefined;
	}

	return Math.round(((a - b) / Math.abs(b)) * 100);
};

const scale = (a: number, b: number) => {
	if (Math.abs(b) < Number.EPSILON) {
		return a === 0 ? undefined : 2;
	}

	return a / Math.abs(b);
};
