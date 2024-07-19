"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@itell/ui/client";

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

export const QuestionChart = ({ data }: Props) => {
	return (
		<ChartContainer
			config={chartConfig}
			className="max-w-[600px] min-h-[100px]"
		>
			<BarChart
				accessibilityLayer
				data={data}
				layout="vertical"
				margin={{
					left: 0,
					right: 32,
				}}
			>
				<YAxis
					dataKey="name"
					type="category"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					hide
				/>
				<XAxis dataKey="value" type="number" hide />
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel indicator="line" />}
				/>
				<Bar dataKey="value" layout="vertical" radius={5}>
					<LabelList
						dataKey="name"
						position="insideLeft"
						offset={8}
						className="fill-[--color-label] text-base xl:text-lg"
						fontSize={12}
						formatter={(value: string) => {
							return chartConfig[value as keyof typeof chartConfig]?.label;
						}}
					/>
					<LabelList
						dataKey="value"
						position="right"
						className="fill-foreground text-base xl:text-lg"
						offset={8}
						fontSize={12}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
};
