import { useSession } from "@/lib/auth/context";
import { createEvent } from "@/lib/event/actions";
import { parseEventStream } from "@itell/core/utils";
import * as Sentry from "@sentry/nextjs";
import { HelpCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../client-components";
import { Spinner } from "../spinner";

export const ExplainButton = ({
	pageSlug,
	chunkSlug,
}: { pageSlug: string; chunkSlug: string }) => {
	const { user } = useSession();
	const [input, setInput] = useState("");
	const [response, setResponse] = useState("");
	const { pending, data } = useFormStatus();
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
						const { text } = JSON.parse(data) as {
							request_id: string;
							text: string;
						};
						response = text;
						setResponse(response);
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

	useEffect(() => {
		if (data) {
			setInput(String(data.get("input")));
		}
	}, [data]);

	return (
		<div className="flex flex-col items-center justify-center">
			{response && <p className="text-sm text-muted-foreground">{response}</p>}
			<Button
				variant="secondary"
				className="gap-2"
				type="button"
				disabled={isPending || response !== ""}
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
