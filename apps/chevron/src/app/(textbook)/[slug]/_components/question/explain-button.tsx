"use client";
import { createEventAction } from "@/actions/event";
import { useSession } from "@/components/provider/session-provider";
import { Spinner } from "@/components/spinner";
import { EventType } from "@/lib/constants";
import { reportSentry } from "@/lib/utils";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { parseEventStream } from "@itell/core/utils";
import { Button } from "@itell/ui/client";
import { Warning } from "@itell/ui/server";
import { HelpCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useActionStatus } from "use-action-status";

type Props = {
	pageSlug: string;
	chunkSlug: string;
	input: string;
};

export const ExplainButton = ({ pageSlug, chunkSlug, input }: Props) => {
	const { user } = useSession();
	const [response, setResponse] = useState("");
	const { pending: formPending } = useFormStatus();
	const { action, isPending, isDelayed, isError, error } = useActionStatus(
		async () => {
			const res = await fetch("/api/itell/score/explain", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pageSlug: pageSlug,
					chunkSlug: chunkSlug,
					studentResponse: input,
				}),
			});

			let response = "";
			if (res.ok && res.body) {
				await parseEventStream(res.body, (data, done) => {
					if (!done) {
						try {
							const { text } = JSON.parse(data) as {
								request_id: string;
								text: string;
							};
							response = text;
							setResponse(response);
						} catch {
							console.log("invalid json", data);
						}
					}
				});
			}

			if (user) {
				createEventAction({
					type: EventType.EXPLAIN,
					pageSlug,
					data: { chunkSlug, response },
				});
			}
		},
	);

	useEffect(() => {
		if (isError) {
			console.log("explain cr", error);
			reportSentry("explain cr", { error });
		}
	}, [isError]);

	return (
		<div className="flex flex-col items-center justify-center">
			{response && <p className="text-sm text-muted-foreground">{response}</p>}
			<Button
				variant="secondary"
				className="gap-2"
				type="button"
				disabled={formPending || isPending}
				onClick={action}
			>
				{isPending ? (
					<Spinner className="size-4" />
				) : (
					<HelpCircleIcon className="size-4" />
				)}
				How can I improve my answer?
			</Button>

			{isError && <Warning>{ErrorFeedback[ErrorType.INTERNAL]}</Warning>}

			{isDelayed && (
				<p className="text-sm">
					The request is taking longer than usual, if this keeps loading without
					a response, please try refreshing the page. If the problem persists,
					please report to lear.lab.vu@gmail.com.
				</p>
			)}
		</div>
	);
};
