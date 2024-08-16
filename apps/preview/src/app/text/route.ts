export const GET = async (req: Request) => {
	const url = new URL(req.url);
	const value = url.searchParams.get("value");
	if (!value) {
		return Response.redirect(new URL("/", url.origin), 302);
	}

	const dst = new URL("/", url.origin);
	const plain = url.searchParams.get("plain");
	dst.searchParams.set("text", plain === "false" ? value : btoa(value));

	return Response.redirect(dst, 302);
};
