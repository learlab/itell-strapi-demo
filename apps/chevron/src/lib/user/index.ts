import db from "@/lib/db";

export const getUser = async (userId: string) => {
	return await db.user.findUnique({
		where: {
			id: userId,
		},
	});
};
