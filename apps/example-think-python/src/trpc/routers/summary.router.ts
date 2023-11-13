import { protectedProcedure, router } from "../utils";
import { z } from "zod";
import { SummaryScoreSchema } from "../schema";

const SummaryRouter = router({
	getAllByUser: protectedProcedure.query(({ ctx }) => {
		const { id } = ctx.user;
		return ctx.prisma.summary.findMany({
			where: {
				userId: id,
			},
		});
	}),

	countWithChapter: protectedProcedure
		.input(
			z.object({
				chapter: z.number(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { id } = ctx.user;
			return await ctx.prisma.summary.count({
				where: {
					chapter: input.chapter,
					userId: id,
				},
			});
		}),

	create: protectedProcedure
		.input(
			z.object({
				text: z.string(),
				chapter: z.number(),
				score: SummaryScoreSchema,
				isPassed: z.boolean(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = ctx.user;
			return await ctx.prisma.summary.create({
				data: {
					text: input.text,
					chapter: input.chapter,
					isPassed: input.isPassed,
					contentScore: input.score.content,
					wordingScore: input.score.wording,
					similarityScore: input.score.similarity,
					containmentScore: input.score.containment,
					user: {
						connect: {
							id,
						},
					},
				},
			});
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				text: z.string(),
				score: SummaryScoreSchema,
				isPassed: z.boolean(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.summary.update({
				where: {
					id: input.id,
				},
				data: {
					text: input.text,
					contentScore: input.score.content,
					wordingScore: input.score.wording,
					similarityScore: input.score.similarity,
					containmentScore: input.score.containment,
					isPassed: input.isPassed,
				},
			});
		}),
});

export default SummaryRouter;
