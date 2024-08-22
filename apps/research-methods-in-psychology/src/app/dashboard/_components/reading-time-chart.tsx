"use client";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@itell/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList } from "recharts";

const chartConfig = {
	value: {
		label: "Reading Time",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

type Props = {
	data: { name: string; value: number }[];
};

export const ReadingTimeChart = ({ data }: Props) => {
	return (
		<ChartContainer config={chartConfig} className="w-full h-[350px]">
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
					formatter={(value: number) => `${Math.round(value)} minutes`}
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
							return `${Math.round(value)} minutes`;
						}}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
};
