export const GET = async (req: Request) => {
	const url = new URL(req.url);
	const text = url.searchParams.get("value");
	if (!text) {
		return Response.redirect(new URL("/", url.origin), 302);
	}

	const dst = new URL("/", url.origin);
	dst.searchParams.set("text", btoa(text));

	return Response.redirect(dst, 302);
};
