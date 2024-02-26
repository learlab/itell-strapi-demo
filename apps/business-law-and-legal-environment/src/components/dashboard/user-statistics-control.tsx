"use client";

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/client-components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { ReadingTimeChartLevel } from "@itell/core/types";
import { Spinner } from "../spinner";

export const UserStatisticsControl = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			// @ts-ignore
			const params = new URLSearchParams(searchParams);
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

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
		startTransition(() => {
			router.push(
				`${pathname}?${createQueryString("reading_time_level", val)}`,
			);
		});
	};

	return (
		<div className="flex items-center gap-4">
			<p className="text-sm font-semibold">Change time span</p>
			{isPending ? (
				<Spinner className="size-4" />
			) : (
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
			)}
		</div>
	);
};
