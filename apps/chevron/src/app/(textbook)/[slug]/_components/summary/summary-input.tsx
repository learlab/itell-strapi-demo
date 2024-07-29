"use client";

import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { StageItem } from "@/lib/hooks/use-summary-stage";
import { useSafeSearchParams } from "@/lib/navigation";
import { makeInputKey } from "@/lib/utils";
import { cn, numOfWords } from "@itell/core/utils";
import { Label } from "@itell/ui/client";
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
	value?: string;
	disabled?: boolean;
};

export const SummaryInput = forwardRef<HTMLElement, Props>(
	(
		{ pageSlug, stages, disabled = true, value = "", pending, userRole },
		ref,
	) => {
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
			<div className="relative">
				<p
					aria-hidden="true"
					className="isolate text-sm font-light absolute right-2 bottom-2 opacity-70"
				>
					{pluralize("word", numOfWords(input), true)}
				</p>
				<Label>
					<span className="sr-only">your summary</span>
					<textarea
						name="input"
						ref={ref as ForwardedRef<HTMLTextAreaElement>}
						value={input}
						disabled={disabled}
						aria-disabled={disabled}
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
							"flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							"resize-none rounded-md shadow-md p-4 w-full ",
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
