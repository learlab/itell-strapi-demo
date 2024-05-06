import { env } from "@/env.mjs";
import { HelpCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../client-components";
import { Spinner } from "../spinner";

export const ExplainButton = ({
	pageSlug,
	chunkSlug,
}: { pageSlug: string; chunkSlug: string }) => {
	const [input, setInput] = useState("");
	const [response, setResponse] = useState("");
	const { pending, data } = useFormStatus();
	const [loading, setLoading] = useState(false);
	const isPending = pending || loading;

	const onClick = async () => {
		setLoading(true);
		const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/chat/CRI`, {
			method: "POST",
			body: JSON.stringify({
				page_slug: pageSlug,
				chunk_slug: chunkSlug,
				student_response: input,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.body) {
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let done = false;
			while (!done) {
				const { value, done: done_ } = await reader.read();
				done = done_;
				const chunk = decoder.decode(value);
				if (chunk) {
					const chunkValue = JSON.parse(chunk.trim().split("\u0000")[0]) as {
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
