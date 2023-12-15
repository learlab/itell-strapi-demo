import { protectedProcedure, router } from "../utils";

const SummaryRouter = router({
	getAllByUser: protectedProcedure.query(({ ctx }) => {
		const { id } = ctx.user;
		return ctx.prisma.summary.findMany({
			where: {
				userId: id,
			},
		});
	}),
});

export default SummaryRouter;
