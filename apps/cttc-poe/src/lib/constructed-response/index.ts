import db from "../db";

export const getConstructedResponse = async (userId: string) => {
	return await db.constructedResponse.findMany({
		where: {
			userId,
		},
	});
};
