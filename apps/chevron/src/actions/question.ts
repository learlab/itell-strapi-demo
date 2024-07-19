"use server";

import {
	CreateConstructedResponseFeedbackSchema,
	CreateConstructedResponseSchema,
	constructed_responses,
	constructed_responses_feedback,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { reportSentry } from "@/lib/utils";
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
		return await db.insert(constructed_responses).values({
			...input,
			userId: ctx.user.id,
		});
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
