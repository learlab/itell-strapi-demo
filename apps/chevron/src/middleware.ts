import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const response = NextResponse.next();
	if (pathname.startsWith("/dashboard") || pathname.startsWith("/summary/")) {
		if (!request.cookies.has("auth_session")) {
			return NextResponse.redirect(new URL("/auth", request.nextUrl.origin));
		}
	}

	response.headers.set("x-pathname", pathname);
	return response;
}
