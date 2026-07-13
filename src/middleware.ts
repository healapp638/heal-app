import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "./routerKeys";

export function middleware(req: NextRequest) {
  const isAuth = req.cookies.get("auth")?.value || null;
  const pathname = req.nextUrl.pathname;

  // Guest-only routes
  const AUTH_PAGES: string[] = [
    ROUTES.WELCOME.WELCOME,
    ROUTES.AUTH.VERIFY_OTP,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
  ];

  const isAuthPage = AUTH_PAGES.includes(pathname);

  // Common public routes (untouched by redirection)
  const isCommonPage = pathname === ROUTES.COMMON.DELETE;

  // Protected pages are anything that is not an auth page and not a common page, except static files
  const isProtectedPage = !isAuthPage && !isCommonPage && pathname !== "/";

  // Logged-in user visiting guest pages (welcome/login/etc) -> redirect home
  if (isAuth && (isAuthPage || pathname === "/")) {
    return NextResponse.redirect(new URL(ROUTES.PRIVATE.HOME, req.url));
  }

  // Guest visiting protected pages -> redirect login
  if (!isAuth && isProtectedPage) {
    return NextResponse.redirect(new URL(ROUTES.WELCOME.WELCOME, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - og-image.png, manifest.json, sw.js, icons, etc. (PWA and assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.js|.*\\.json|icons|workbox-).*)",
  ],
};
