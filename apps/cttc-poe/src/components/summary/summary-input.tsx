"use client";

import { isProduction } from "@/lib/constants";
import { StageItem } from "@/lib/hooks/use-summary-stage";
import { useSafeSearchParams } from "@/lib/navigation";
import { makeInputKey } from "@/lib/utils";
import { cn, numOfWords } from "@itell/core/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfig } from "../provider/page-provider";
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
	value?: string;
	disabled?: boolean;
};

export const SummaryInput = ({
	pageSlug,
	stages,
	disabled = true,
	value = "",
	pending,
}: Props) => {
	const isAdmin = useConfig((state) => state.isAdmin);
	const { summary } = useSafeSearchParams("textbook");
	const text = summary
		? Buffer.from(summary, "base64").toString("ascii")
		: value;
	const [input, setInput] = useState(text);

	useEffect(() => {
		if (!summary) {
			setInput(getSummaryLocal(pageSlug) || value);
		}
	}, []);

	return (
		<>
			<p className="text-sm font-light">Number of words: {numOfWords(input)}</p>
			<div className="relative">
				<textarea
					name="input"
					value={input}
					disabled={disabled}
					placeholder={"Write your summary here"}
					onChange={(e) => setInput(e.currentTarget.value)}
					rows={10}
					onPaste={(e) => {
						if (isProduction && !isAdmin) {
							e.preventDefault();
							toast.warning("Copy & Paste is not allowed");
						}
					}}
					className={cn(
						"flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						"resize-none rounded-md shadow-md p-4 w-full ",
					)}
				/>
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
		</>
	);
};
