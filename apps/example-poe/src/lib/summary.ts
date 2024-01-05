import { env } from "@/env.mjs";
import { SummaryResponseSchema } from "@itell/core/summary";

export const getScore = async ({
	input,
	pageSlug,
}: { input: string; pageSlug: string }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/summary`, {
		method: "POST",
		body: JSON.stringify({
			summary: input,
			page_slug: pageSlug,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	return SummaryResponseSchema.safeParse(data);
};
