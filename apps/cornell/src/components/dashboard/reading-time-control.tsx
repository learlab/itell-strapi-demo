"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/client-components";
import { ReadingTimeChartLevel } from "@itell/core/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Spinner } from "../spinner";

export const ReadingTimeControl = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [pending, startTransition] = useTransition();

	let defaultValue: string;
	if (searchParams) {
		const level = searchParams.get("reading_time_level");
		if (level && level in ReadingTimeChartLevel) {
			defaultValue = level;
		} else {
			defaultValue = ReadingTimeChartLevel.week_1;
		}
	} else {
		defaultValue = ReadingTimeChartLevel.week_1;
	}

	const handleSelect = (val: string) => {
		const url = new URL(window.location.href);
		url.searchParams.set("reading_time_level", val);
		startTransition(() => {
			router.push(url.toString(), { scroll: false });
		});
	};

	return (
		<div
			className="flex items-center gap-4"
			data-pending={pending ? "" : undefined}
		>
			<Select defaultValue={defaultValue} onValueChange={handleSelect}>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Select a time span" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ReadingTimeChartLevel.week_1}>
						Last week
					</SelectItem>
					<SelectItem value={ReadingTimeChartLevel.week_2}>
						Last two weeks
					</SelectItem>
					<SelectItem value={ReadingTimeChartLevel.month_1}>
						Last month
					</SelectItem>
					<SelectItem value={ReadingTimeChartLevel.month_2}>
						Last two months
					</SelectItem>
					<SelectItem value={ReadingTimeChartLevel.month_3}>
						Last three months
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
