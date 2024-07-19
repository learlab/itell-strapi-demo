import { getSession } from "@/lib/auth";
import { createServerActionProcedure } from "zsa";

export const authedProcedure = createServerActionProcedure().handler(
	async () => {
		try {
			const { user } = await getSession();
			if (!user) {
				throw new Error("Unauthorized");
			}

			return { user };
		} catch (error) {
			throw new Error("Unauthorized");
		}
	},
);
