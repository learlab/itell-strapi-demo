import { setCurrentChunk } from "./utils";

export const POST = async (req: Request) => {
	const { page_slug, current_chunk } = (await req.json()) as {
		page_slug: string;
		current_chunk: string;
	};
	setCurrentChunk(page_slug, current_chunk);
	return new Response("ok", { status: 201 });
};
