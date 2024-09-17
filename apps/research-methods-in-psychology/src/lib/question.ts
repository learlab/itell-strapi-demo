import { ScoreSchema } from "@itell/core/question";
import { client } from "./api-client";

// async function to get QA scores from scoring API
export const getQAScore = async ({
	input,
	chunk_slug,
	page_slug,
}: { input: string; chunk_slug: string; page_slug: string }) => {
	const res = await client.api.hello.$get();
	const data2 = await res.json();
	console.log(data2);
	// const response = await fetch("/api/itell/score/answer", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		pageSlug: page_slug,
	// 		chunkSlug: chunk_slug,
	// 		answer: input,
	// 	}),
	// });

	// const data = await response.json();
	// return ScoreSchema.parse(data);
};
