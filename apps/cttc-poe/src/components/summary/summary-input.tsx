"use client";

import { TextArea } from "@/components/client-components";
import { isProduction } from "@/lib/constants";
import { makeInputKey } from "@/lib/utils";
import { cn, numOfWords } from "@itell/core/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StageItem, SummaryProgress } from "./summary-progress";

type Props = {
	pageSlug: string;
	stages: StageItem[];
	pending: boolean;
	value?: string;
	disabled?: boolean;
	isAdmin?: boolean;
};

export const SummaryInput = ({
	pageSlug,
	stages,
	disabled = true,
	value = "",
	pending,
	isAdmin = false,
}: Props) => {
	const searchParams = useSearchParams();
	const summaryToRevise = searchParams?.get("summary");
	const text = summaryToRevise
		? Buffer.from(summaryToRevise, "base64").toString("ascii")
		: value;
	const [input, setInput] = useState(text);

	useEffect(() => {
		if (!summaryToRevise) {
			setInput(localStorage.getItem(makeInputKey(pageSlug)) || value);
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
