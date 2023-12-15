"use client";

import { Summary } from "@prisma/client";
import { FormEvent, useEffect, useState } from "react";
import { Button, TextArea } from "../client-components";
import { ScoreResponse, useSummary } from "@/lib/hooks/use-summary";
import { SummaryFeedback } from "../summary/summary-feedback";
import { numOfWords } from "@itell/core/utils";
import { Spinner } from "../spinner";
import { useRouter } from "next/navigation";
import { SectionLocation } from "@/types/location";

type Props =
	| {
			published: true;
			summary: Summary;
	  }
	| {
			published: false;
			location: SectionLocation;
			onScoreResponse?(response: ScoreResponse): void;
	  };

export default function (props: Props) {
	const router = useRouter();
	const [pending, setPending] = useState({
		update: false,
		score: false,
	});
	const { state, setInput, score, update, create } = useSummary({
		useLocalStorage: false,
	});
	const [scoreResponse, setScoreResponse] = useState<ScoreResponse | null>(
		null,
	);
	const [isScored, setIsScored] = useState(false);
	const canUpdate = isScored && !state.error;

	useEffect(() => {
		if (props.published) {
			setInput(props.summary.text);
		} else {
			setInput("");
		}
	}, []);

	const handleUpsert = async (event: FormEvent) => {
		event.preventDefault();

		if (isScored && scoreResponse) {
			setPending({ ...pending, update: true });
			if (props.published) {
				await update({
					summary: props.summary,
					score: scoreResponse.result,
					feedback: scoreResponse.feedback,
					location: {
						module: props.summary.module,
						chapter: props.summary.chapter,
						section: props.summary.section,
					},
				});
				router.refresh();
			} else {
				await create(
					scoreResponse.result,
					scoreResponse.feedback,
					props.location,
				);
				router.push("/dashboard");
			}
			setIsScored(false);
			setPending({ ...pending, update: false });
		}
	};

	const handleScore = async (event: FormEvent) => {
		event.preventDefault();
		const sectionLocation = props.published
			? {
					module: props.summary.module,
					chapter: props.summary.chapter,
					section: props.summary.section,
			  }
			: props.location;

		setPending({ ...pending, score: true });
		const response = await score(sectionLocation);
		if (response) {
			setScoreResponse(response);
			if (!props.published) {
				props.onScoreResponse?.(response);
			}
		}
		setIsScored(true);
		setPending({ ...pending, score: false });
	};

	return (
		<form className="space-y-6">
			<p className="text-sm text-muted-foreground">
				Number of words: {numOfWords(state.input)}
			</p>
			<div className="text-left">
				{state.feedback && <SummaryFeedback feedback={state.feedback} />}
			</div>

			<div className="prose prose-stone dark:prose-invert max-w-2xl  space-y-4">
				<TextArea
					autoFocus
					id="title"
					value={state.input}
					onValueChange={setInput}
					placeholder="Summary Content"
					className="w-full resize-none appearance-none overflow-hidden bg-transparent focus:outline-none min-h-[400px]"
				/>
				<div className="flex justify-between">
					{canUpdate && (
						<Button disabled={state.pending} onClick={handleUpsert}>
							{pending.update && <Spinner className="mr-2" />}
							{props.published ? "Save and update" : "Create"}
						</Button>
					)}
					<Button
						disabled={state.pending}
						onClick={handleScore}
						className="ml-auto"
					>
						{pending.score && <Spinner className="mr-2" />}
						Get score
					</Button>
				</div>
			</div>
		</form>
	);
}
