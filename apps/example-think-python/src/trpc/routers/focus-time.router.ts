import { z } from "zod";
import { protectedProcedure, router } from "../utils";

export const FocusTimeRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				summaryId: z.string().optional(),
				totalViewTime: z.number(),
				data: z.array(
					z.object({
						sectionId: z.string(),
						totalViewTime: z.number(),
					}),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;

			return await ctx.prisma.focusTime.create({
				data: {
					data: input.data,
					summaryId: input.summaryId,
					userId,
					totalViewTime: input.totalViewTime,
				},
			});
		}),
});
