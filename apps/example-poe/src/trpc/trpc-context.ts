import { getApiAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createTrpcContext = async (opts: CreateNextContextOptions) => {
	const { req, res } = opts;
	const session = await getApiAuthSession({ req, res });

	return {
		session,
		prisma: db,
	};
};
export type TrpcContext = inferAsyncReturnType<typeof createTrpcContext>;
