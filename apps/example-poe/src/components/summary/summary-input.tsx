"use client";

import { Button, TextArea } from "@/components/client-components";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { Warning } from "@itell/ui/server";
import { Spinner } from "../spinner";
import { SummaryFeedback } from "./summary-feedback";
import { makeLocationHref, makeInputKey } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn, numOfWords } from "@itell/core/utils";
import { PAGE_SUMMARY_THRESHOLD, isProduction } from "@/lib/constants";
import { trpc } from "@/trpc/trpc-provider";
import { SectionLocation } from "@/types/location";
import { allSectionsSorted } from "@/lib/sections";
import { incrementLocation, isLocationAfter } from "@/lib/location";
import pluralize from "pluralize";
import { toast } from "sonner";

type Props = {
	location: SectionLocation;
	textAreaClassName?: string;
};

export const SummaryInput = ({ location, textAreaClassName }: Props) => {
	const [input, setInput] = useState(
		localStorage.getItem(makeInputKey(location)) || "",
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
