import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getServerSession as getServerSessionNext } from "next-auth/next";

export const getApiAuthSession = async ({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) => {
	return await getServerSession(req, res, authOptions);
};

export const getServerAuthSession = async () => {
	return await getServerSessionNext(authOptions);
};

export async function getCurrentUser() {
	const session = await getServerSession(authOptions);

	return session?.user;
}
