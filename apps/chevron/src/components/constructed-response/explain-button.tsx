import { useSession } from "@/lib/auth/context";
import { createEvent } from "@/lib/event/actions";
import { parseEventStream } from "@itell/core/utils";
import * as Sentry from "@sentry/nextjs";
import { HelpCircleIcon } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../client-components";
import { Spinner } from "../spinner";

type Props = {
	pageSlug: string;
	chunkSlug: string;
	input: string;
};

export const ExplainButton = ({ pageSlug, chunkSlug, input }: Props) => {
	const { user } = ();
	const [response, setResponse] = useState("");
	const { pending } = useFormStatus();
	const [loading, setLoading] = useState(false);
	const isPending = pending || loading;

	const onClick = async () => {
		setLoading(true);
		try {
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
				createEvent({
					userId: user.id,
					type: "explain-constructed-response",
					pageSlug,
					data: { chunkSlug, response },
				});
			}
		} catch (err) {
			Sentry.captureMessage("explain constructed response error", {
				extra: {
					pageSlug,
					chunkSlug,
					studentResponse: input,
					msg: err,
				},
			});
		}

		setLoading(false);
	};

	return (
		<div className="flex flex-col items-center justify-center">
			{response && <p className="text-sm text-muted-foreground">{response}</p>}
			<Button
				variant="secondary"
				className="gap-2"
				type="button"
				disabled={isPending}
				onClick={onClick}
			>
				{isPending ? (
					<Spinner className="size-4" />
				) : (
					<HelpCircleIcon className="size-4" />
				)}
				What's wrong with my answer?
			</Button>
		</div>
	);
};
