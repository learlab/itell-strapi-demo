import { finishPageQuiz } from "@/lib/server-actions";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(request: Request) {
	const { page_slug } = (await request.json()) as { page_slug: string };
	finishPageQuiz(page_slug);

	return Response.json({ success: true });
}
