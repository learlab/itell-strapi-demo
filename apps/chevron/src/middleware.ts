import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/summary/")) {
    if (!request.cookies.has("auth_session")) {
      const url = new URL("/auth", request.nextUrl.origin);
      url.searchParams.set("from_dashboard", "true");
      return NextResponse.redirect(url);
    }
  }

  response.headers.set("x-pathname", pathname);
  return response;
}
