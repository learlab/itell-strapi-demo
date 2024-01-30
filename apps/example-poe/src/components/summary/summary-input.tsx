"use client";

import { TextArea } from "@/components/client-components";
import { isProduction } from "@/lib/constants";
import { makeInputKey } from "@/lib/utils";
import { cn, numOfWords } from "@itell/core/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	pageSlug: string;
	value?: string;
	disabled?: boolean;
	textAreaClassName?: string;
};

export const SummaryInput = ({
	pageSlug,
	textAreaClassName,
	disabled = true,
	value = "",
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
			<TextArea
				name="input"
				placeholder={"Write your summary here"}
				value={input}
				onValueChange={(val) => setInput(val)}
				rows={10}
				disabled={disabled}
				disabledText="Please finish the entire page first"
				className={cn(
					"resize-none rounded-md shadow-md p-4 w-full ",
					textAreaClassName,
				)}
				onPaste={(e) => {
					if (isProduction) {
						e.preventDefault();
						toast.warning("Copy & Paste is not allowed");
					}
				}}
			/>
		</>
	);
};
