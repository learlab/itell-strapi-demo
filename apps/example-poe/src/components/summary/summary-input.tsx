"use client";

import { useState } from "react";
import { TextArea } from "../client-components";
import { isProduction } from "@/lib/constants";
import { toast } from "sonner";
import { cn, numOfWords } from "@itell/core/utils";
import { makeInputKey } from "@/lib/utils";
type Props = {
	chapter: number;
	textAreaClassName?: string;
};

export const SummaryInput = ({ chapter, textAreaClassName }: Props) => {
	const [input, setInput] = useState(
		localStorage.getItem(makeInputKey(chapter)) || "",
	);
	return (
		<>
			<p className="text-sm font-light">Number of words: {numOfWords(input)}</p>
			<TextArea
				name="input"
				placeholder="Write your summary here."
				value={input}
				onValueChange={(val) => setInput(val)}
				rows={10}
				className={cn(
					"resize-none rounded-md shadow-md p-4 w-full",
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
