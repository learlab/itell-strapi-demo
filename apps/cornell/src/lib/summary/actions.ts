"use server";

import { SummaryResponse } from "@itell/core/summary";
import { getCurrentUser } from "../auth";
import db from "../db";

export const createSummary = async ({
	text,
	pageSlug,
	response,
}: { text: string; pageSlug: string; response: SummaryResponse }) => {
	const user = await getCurrentUser();
	if (user) {
		return await db.summary.create({
			data: {
				text,
				pageSlug,
				isPassed: response.is_passed,
				containmentScore: response.containment,
				similarityScore: response.similarity,
				wordingScore: response.wording,
				contentScore: response.content,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});
	}
};

export const findFocusTime = async (userId: string, pageSlug: string) => {
	return await db.focusTime.findUnique({
		where: {
			userId_pageSlug: {
				userId,
				pageSlug,
			},
		},
	});
};
