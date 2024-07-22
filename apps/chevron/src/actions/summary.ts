"use server";
import { db } from "@/actions/db";
import {
	events,
	CreateSummarySchema,
	summaries,
	users,
} from "@/drizzle/schema";
import {
	EventType,
	PAGE_SUMMARY_THRESHOLD,
	isProduction,
} from "@/lib/constants";
import { Condition } from "@/lib/constants";
import { isLastPage, isPageAfter, nextPage } from "@/lib/pages";
import { reportSentry } from "@/lib/utils";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";
import { authedProcedure } from "./utils";

/**
 * - Create summary record for current user
 * - If summary is passed or enough summaries has been written, update user's page slug to the next page that requires s summary, if user is at the last page, set finished to true
 * - Create keystroke events
 */
export const createSummaryAction = authedProcedure
	.createServerAction()
	.input(
		z.object({
			summary: CreateSummarySchema.omit({ userId: true }),
			keystroke: z.object({
				start: z.string(),
				data: z.array(z.array(z.union([z.number(), z.string()]))),
			}),
		}),
	)
	.onError((error) => {
		reportSentry("create summary", { error });
	})
	.output(
		z.object({ nextPageSlug: z.string().nullable(), canProceed: z.boolean() }),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.transaction(async (tx) => {
			// count
			let canProceed =
				input.summary.condition === Condition.STAIRS
					? input.summary.isPassed
					: true;
			if (!canProceed) {
				const [record] = await tx
					.select({ count: count() })
					.from(summaries)
					.where(
						and(
							eq(summaries.userId, ctx.user.id),
							eq(summaries.pageSlug, input.summary.pageSlug),
						),
					);
				canProceed = record.count + 1 >= PAGE_SUMMARY_THRESHOLD;
			}

			// create summary record
			const { summaryId } = (
				await tx
					.insert(summaries)
					.values({
						...input.summary,
						userId: ctx.user.id,
					})
					.returning({ summaryId: summaries.id })
			)[0];

			// create events
			if (isProduction) {
				await tx.insert(events).values({
					type: EventType.KEYSTROKE,
					pageSlug: input.summary.pageSlug,
					userId: ctx.user.id,
					data: {
						summaryId,
						start: input.keystroke.start,
						keystrokes: input.keystroke.data,
					},
				});
			}

			// update user page slug
			const nextPageSlug = nextPage(input.summary.pageSlug);
			const shouldUpdateUserPageSlug = isPageAfter(
				nextPageSlug,
				ctx.user.pageSlug,
			);

			if (canProceed) {
				await tx
					.update(users)
					.set({
						pageSlug: shouldUpdateUserPageSlug ? nextPageSlug : undefined,
						finished: isLastPage(input.summary.pageSlug),
					})
					.where(eq(users.id, ctx.user.id));
			}

			return {
				nextPageSlug: shouldUpdateUserPageSlug
					? nextPageSlug
					: ctx.user.pageSlug,
				canProceed,
			};
		});
		return data;
	});

/**
 * Get summary current user, if summary id is not provided, return all summaries
 */
export const getSummariesAction = authedProcedure
	.createServerAction()
	.input(z.object({ summaryId: z.number().optional() }))
	.onError((error) => {
		reportSentry("get summaries", { error });
	})
	.handler(async ({ input, ctx }) => {
		return await getSummariesHandler(ctx.user.id, input.summaryId);
	});

export const getSummariesHandler = memoize(
	async (userId: string, summaryId?: number) => {
		return await db
			.select()
			.from(summaries)
			.where(
				and(
					eq(summaries.userId, userId),
					summaryId !== undefined ? eq(summaries.id, summaryId) : undefined,
				),
			)
			.orderBy(desc(summaries.updatedAt));
	},
	{
		persist: false,
		revalidateTags: (userId, summaryId) => [
			"get-summaries",
			userId,
			String(summaryId),
		],
		log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
		logid: "Get summaries",
	},
);

/**
 * Count summaries by pass / fail for current user and page
 */
export const countSummaryByPassingAction = authedProcedure
	.createServerAction()
	.onError((error) => {
		reportSentry("count summary by passing", { error });
	})
	.input(z.object({ pageSlug: z.string() }))
	.handler(async ({ input, ctx }) => {
		const record = await db
			.select({
				passed: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
				failed: count(sql`CASE WHEN NOT ${summaries.isPassed} THEN 1 END`),
			})
			.from(summaries)
			.where(
				and(
					eq(summaries.userId, ctx.user.id),
					eq(summaries.pageSlug, input.pageSlug),
				),
			);

		return record[0];
	});
