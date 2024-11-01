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

  response.headers.append("Access-Control-Allow-Credentials", "true");
  response.headers.append("Access-Control-Allow-Origin", "*");
  response.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  response.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

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
