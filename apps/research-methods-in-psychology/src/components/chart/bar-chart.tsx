"use client";
import {
	Bar,
	BarChart as BaseBarChart,
	LabelList,
	ResponsiveContainer,
	Text,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type Props = {
	data: { name: string; value: number }[];
	addLabel?: boolean;
	yAxisOptions?: React.ComponentPropsWithoutRef<typeof YAxis>;
	xAxisOptions?: React.ComponentPropsWithoutRef<typeof XAxis>;
	unit?: string;
};

export const BarChart = ({
	data,
	unit,
	xAxisOptions,
	yAxisOptions,
	addLabel = false,
}: Props) => {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<BaseBarChart data={data}>
				<XAxis
					dataKey="name"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					{...xAxisOptions}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value} ${unit || ""}`}
					{...yAxisOptions}
				/>
				<Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]}>
					{addLabel && <LabelList dataKey={"value"} />}
				</Bar>
				<Tooltip
					cursor={{ fill: "transparent" }}
					content={({ active, payload, label }) => {
						if (active && payload && payload.length) {
							const value = Number(payload[0].value).toFixed(2);
							return (
								<div className="bg-background p-4 text-foreground rounded-md shadow border border-border">
									<p className="label">{`${label} : ${value} ${unit || ""}`}</p>
								</div>
							);
						}
					}}
				/>
			</BaseBarChart>
		</ResponsiveContainer>
	);
};
