import db from "./db";

export const getUser = async (userId: string) => {
	return await db.user.findUnique({
		where: {
			id: userId,
		},
	});
};
