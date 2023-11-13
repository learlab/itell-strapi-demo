import { z } from "zod";
import { protectedProcedure, router } from "../utils";

const NoteRouter = router({
	getByChapter: protectedProcedure
		.input(z.object({ chapter: z.number() }))
		.query(async ({ ctx, input }) => {
			const { id } = ctx.user;
			return await ctx.prisma.note.findMany({
				where: {
					userId: id,
					chapter: input.chapter,
				},
			});
		}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		const { id } = ctx.user;
		return await ctx.prisma.note.findMany({
			where: {
				userId: id,
			},
		});
	}),

	create: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				y: z.number(),
				noteText: z.string().optional(),
				highlightedText: z.string(),
				color: z.string(),
				chapter: z.number(),
				range: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = ctx.user;
			return await ctx.prisma.note.create({
				data: {
					id: input.id,
					noteText: input.noteText,
					highlightedText: input.highlightedText,
					y: input.y,
					chapter: input.chapter,
					color: input.color,
					userId: id,
					range: input.range,
				},
			});
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				noteText: z.string().optional(),
				color: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.note.update({
				where: {
					id: input.id,
				},
				data: {
					noteText: input.noteText,
					color: input.color,
				},
			});
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.note.delete({
				where: {
					id: input.id,
				},
			});
		}),
});

export default NoteRouter;
