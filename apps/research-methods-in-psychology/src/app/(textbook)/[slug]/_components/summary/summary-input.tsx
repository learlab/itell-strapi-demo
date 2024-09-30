"use client";

import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { StageItem } from "@/lib/hooks/use-summary-stage";
import { useSafeSearchParams } from "@/lib/navigation";
import { makeInputKey } from "@/lib/utils";
import { Elements } from "@itell/constants";
import { useDebounce } from "@itell/core/hooks";
import { levenshteinDistance } from "@itell/core/summary";
import { Label } from "@itell/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@itell/ui/tooltip";
import { cn, numOfWords } from "@itell/utils";
import { InfoIcon } from "lucide-react";
import pluralize from "pluralize";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { SummaryProgress } from "./summary-progress";

export const saveSummaryLocal = (pageSlug: string, text: string) => {
	localStorage.setItem(makeInputKey(pageSlug), text);
};

export const getSummaryLocal = (pageSlug: string) => {
	return localStorage.getItem(makeInputKey(pageSlug));
};

export const clearSummaryLocal = (pageSlug: string) => {
	localStorage.removeItem(makeInputKey(pageSlug));
};

type Props = {
	pageSlug: string;
	stages: StageItem[];
	pending: boolean;
	userRole: string;
	prevInput?: string;
	enableSimilarity?: boolean;
	value?: string;
	disabled?: boolean;
};

export const SummaryInput = forwardRef<HTMLElement, Props>(
	(
		{
			pageSlug,
			stages,
			disabled = true,
			value = "",
			pending,
			userRole,
			enableSimilarity = false,
			prevInput,
		},
		ref,
	) => {
		const { summary } = useSafeSearchParams("textbook");
		const text = summary
			? Buffer.from(summary, "base64").toString("ascii")
			: value;
		const [input, setInput] = useState(text);
		const debounced = useDebounce(input, 500);

		const distance =
			enableSimilarity && prevInput
				? levenshteinDistance(debounced, prevInput)
				: undefined;

		useEffect(() => {
			if (!summary) {
				setInput(getSummaryLocal(pageSlug) || value);
			}
		}, []);

		return (
			<div className="relative">
				{distance !== undefined ? <Distance distance={distance} /> : null}
				<p
					aria-hidden="true"
					className="z-1 text-sm font-light absolute right-2 bottom-2 opacity-70"
				>
					{pluralize("word", numOfWords(input), true)}
				</p>

				<Label>
					<span className="sr-only">your summary</span>
					<textarea
						spellCheck={true}
						id={Elements.SUMMARY_INPUT}
						name="input"
						ref={ref as ForwardedRef<HTMLTextAreaElement>}
						value={input}
						disabled={disabled}
						placeholder={"Write your summary here"}
						onChange={(e) => setInput(e.currentTarget.value)}
						rows={10}
						onPaste={(e) => {
							if (isProduction && !isAdmin(userRole)) {
								e.preventDefault();
								toast.warning("Copy & Paste is not allowed");
							}
						}}
						className={cn(
							"flex min-h-[80px] w-full font-normal rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							"resize-none rounded-md shadow-md p-4 w-full xl:text-lg",
						)}
					/>
				</Label>

				{pending ? (
					<div className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 animate-in animate-out gap-2 cursor-not-allowed">
						<SummaryProgress items={stages} />
					</div>
				) : (
					disabled && (
						<div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-100 animate-in animate-out gap-2 cursor-not-allowed">
							Please finish the entire page first
						</div>
					)
				)}
			</div>
		);
	},
);
const distanceThreshold = 60;

const Distance = ({ distance }: { distance: number }) => {
	return (
		<div className="flex items-center gap-2 mb-2">
			<div className="relative flex-1 h-8 bg-accent rounded-full overflow-hidden">
				<div
					className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${
						distance >= distanceThreshold ? "bg-info" : "bg-warning"
					}`}
					style={{ width: `${distance}%` }}
				/>
				<div
					className="absolute top-0 bottom-0 w-[4px] bg-info"
					style={{ left: `${distanceThreshold}%` }}
				/>
				<div className="absolute inset-0 flex items-center justify-between px-3">
					<span className="text-sm font-medium z-10">Uniqueness</span>
					<span className="text-sm font-medium z-10">
						{Math.min(distance, 100).toFixed(1)}%
					</span>
				</div>
			</div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<InfoIcon className="size-6 flex-shrink-0" />
					</TooltipTrigger>
					<TooltipContent className="w-64">
						Revise your summary to make it more unique to your previous summary
						(pass the threshold indicated by the blue bar).
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
