"use server";

import { db } from "@/actions/db";
import {
	CreateConstructedResponseFeedbackSchema,
	CreateConstructedResponseSchema,
	constructed_responses,
	constructed_responses_feedback,
} from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { reportSentry } from "@/lib/utils";
import { count, eq } from "drizzle-orm";
import { authedProcedure } from "./utils";

/**
 * Create constructed response item
 */
export const createQuestionAnswerAction = authedProcedure
	.createServerAction()
	.input(CreateConstructedResponseSchema.omit({ userId: true }))
	.onError((err) => {
		reportSentry("create constructed response", { error: err });
	})
	.handler(async ({ input, ctx }) => {
		if (isProduction) {
			return await db.insert(constructed_responses).values({
				...input,
				userId: ctx.user.id,
			});
		}
	});

/**
 * Create constructed response feedback
 */
export const createQuestionFeedbackAction = authedProcedure
	.createServerAction()
	.input(CreateConstructedResponseFeedbackSchema.omit({ userId: true }))
	.handler(async ({ input, ctx }) => {
		return await db.insert(constructed_responses_feedback).values({
			...input,
			userId: ctx.user.id,
		});
	});

/**
 * Get question-answer statistics
 *
 * - all answers
 * - count answers by score
 */
export const getAnswerStatsAction = authedProcedure
	.createServerAction()
	.onError((err) => {
		reportSentry("get answer stats", { error: err });
	})
	.handler(async ({ ctx }) => {
		return await db.transaction(async (tx) => {
			const records = await tx
				.select()
				.from(constructed_responses)
				.where(eq(constructed_responses.userId, ctx.user.id));

			const byScore = await tx
				.select({
					count: count(),
					score: constructed_responses.score,
				})
				.from(constructed_responses)
				.where(eq(constructed_responses.userId, ctx.user.id))
				.groupBy(constructed_responses.score);

			return { records, byScore };
		});
	});
