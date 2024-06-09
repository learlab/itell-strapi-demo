"use client";
import { useSession } from "@/lib/auth/context";
import { createEvent } from "@/lib/event/actions";
import { reportSentry } from "@/lib/utils";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { parseEventStream } from "@itell/core/utils";
import { Warning } from "@itell/ui/server";
import { HelpCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useActionStatus } from "use-action-status";
import { Button } from "../client-components";
import { Spinner } from "../spinner";

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
							throw new Error("invalid json");
						}
					}
				});
			}

			if (user) {
				createEvent({
					userId: user.id,
					type: "explain-constructed-response",
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
				What's wrong with my answer?
			</Button>

			{isError && <Warning>{ErrorFeedback[ErrorType.INTERNAL]}</Warning>}

			{isDelayed && (
				<p className="text-sm">
					The request is taking long than usual, you can try refreshing and try
					again. If this problem persists, please report to
					lear.lab.vu@gmail.com.
				</p>
			)}
		</div>
	);
};
