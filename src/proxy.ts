import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const hasSessionCookie =
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  const isLoggedIn = Boolean(token) || hasSessionCookie;

  // Proxy behavior for the root page (src/app/page.tsx)
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = isLoggedIn ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  // If already signed in, keep users out of the login page
  if (pathname === "/login") {
    if (isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
