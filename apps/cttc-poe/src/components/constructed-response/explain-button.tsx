import { env } from "@/env.mjs";
import { useSession } from "@/lib/auth/context";
import { createEvent } from "@/lib/event/actions";
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

		let chunkValue = { request_id: "", text: "" };
		if (res.ok && res.body) {
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let done = false;
			while (!done) {
				const { value, done: done_ } = await reader.read();
				done = done_;
				const chunk = decoder.decode(value);
				if (chunk) {
					chunkValue = JSON.parse(chunk.trim().split("\u0000")[0]) as {
						request_id: string;
						text: string;
					};

					if (chunkValue) {
						setResponse(chunkValue.text);
					}
				}
			}
		}
		setLoading(false);

		if (user) {
			createEvent({
				userId: user.id,
				type: "explain-constructed-response",
				pageSlug,
				data: { chunkSlug, response: chunkValue.text },
			});
		}
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
