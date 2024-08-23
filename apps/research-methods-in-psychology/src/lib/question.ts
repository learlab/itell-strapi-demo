import { ScoreSchema } from "@itell/core/question";

// async function to get QA scores from scoring API
export const getQAScore = async ({
	input,
	chunk_slug,
	page_slug,
}: { input: string; chunk_slug: string; page_slug: string }) => {
	const response = await fetch("/api/itell/score/answer", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			pageSlug: page_slug,
			chunkSlug: chunk_slug,
			answer: input,
		}),
	});

	const data = await response.json();
	return ScoreSchema.parse(data);
};
