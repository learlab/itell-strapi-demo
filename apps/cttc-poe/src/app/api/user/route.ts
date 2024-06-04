import { incrementUserPage } from "@/lib/user/actions";

type Input = {
	userId: string;
	pageSlug: string;
};

// for incrementing user's page slug
export const POST = async (req: Request) => {
	const input = (await req.json()) as Input;
	try {
		await incrementUserPage(input.userId, input.pageSlug);
		return new Response("user updated", { status: 200 });
	} catch (err) {
		return new Response(String(err), { status: 500 });
	}
};
