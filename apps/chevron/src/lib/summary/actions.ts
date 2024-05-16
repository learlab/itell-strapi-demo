"use server";

import { SummaryResponse } from "@itell/core/summary";
import { getSessionUser } from "../auth";
import db from "../db";

export const createSummary = async ({
	text,
	pageSlug,
	response,
}: { text: string; pageSlug: string; response: SummaryResponse }) => {
	const user = await getSessionUser();
	if (user) {
		return await db.summary.create({
			data: {
				text,
				pageSlug,
				isPassed: response.is_passed || false,
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

export const countUserPageSummary = async (
	userId: string,
	pageSlug: string,
) => {
	return await db.summary.count({
		where: {
			userId,
			pageSlug,
		},
	});
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
