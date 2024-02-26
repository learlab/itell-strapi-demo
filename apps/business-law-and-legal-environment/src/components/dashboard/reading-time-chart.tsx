"use client";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type Props = {
	data: { name: string; value: number | string }[];
};

export const ReadingTimeChart = ({ data }: Props) => {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={data}>
				<XAxis
					dataKey="name"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value} min`}
				/>
				<Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
				<Tooltip
					cursor={{ fill: "transparent" }}
					content={({ active, payload, label }) => {
						if (active && payload && payload.length) {
							const value =
								typeof payload[0].value === "number"
									? payload[0].value.toFixed(2)
									: payload[0].value;
							return (
								<div className="bg-background p-4 text-foreground rounded-md shadow border border-border">
									<p className="label">{`${label} : ${value} min`}</p>
								</div>
							);
						}
					}}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};
