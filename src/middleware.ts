import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "./routerKeys";

export function middleware(req: NextRequest) {
  const isAuth = req.cookies.get("auth")?.value || null;

  const pathname = req.nextUrl.pathname;

  
  // Guest-only routes
  const AUTH_PAGES: string[] = [
    ROUTES.WELCOME.WELCOME,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.VERIFY_OTP,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
  ];

  // Protected routes
  const PROTECTED_ROUTES: string[] = [
    ROUTES.PRIVATE.HOME,
    ROUTES.PRIVATE.MODULE,
    ROUTES.PRIVATE.FAQ,
    ROUTES.PRIVATE.PRIVACYPOLICY,
    ROUTES.PRIVATE.TERMSANDCONDITION,
    ROUTES.PRIVATE.CONTACTUS,
    ROUTES.PRIVATE.CATEGORY,
    ROUTES.PRIVATE.HOMETHEME,
    ROUTES.PRIVATE.USERS,
    ROUTES.PRIVATE.USERDETAIL,
    ROUTES.PRIVATE.ADDEXCEL,
    ROUTES.PRIVATE.AFFIRMATION,
    ROUTES.PRIVATE.PROFILE,
    ROUTES.PRIVATE.ADDMODULE,
    ROUTES.PRIVATE.SUBMODULE,
    ROUTES.PRIVATE.ADDPHASES,
    ROUTES.PRIVATE.ADDLESSONS,
    ROUTES.PRIVATE.ADDEXERCISE,
    ROUTES.PRIVATE.ABOUTUS,
    ROUTES.PRIVATE.ADDMCQEXERCISE,

  ];

  // Logged-in user visiting auth pages → redirect home
  if (isAuth && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.PRIVATE.HOME, req.url));
  }

  // Guest visiting protected pages → redirect login
  if (!isAuth && PROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.WELCOME.WELCOME, req.url));
  }

  // COMMON routes are untouched → accessible to everyone
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Welcome page
    '/',

    // Auth pages
    '/register',
    '/otp-verify',
    '/forgot-password',
    '/reset-password',

    // Common pages
    '/terms',
    '/privacy',
    '/delete-account',

    // Private pages
    "/home",
    "/termsandcondition",
    "/privacypolicy",
    "/contactus",
    "/module",
    "/module/addModule",
    "/module/subModule",
    "/module/addPhase",
    "/module/addLessons",
    "/faq",
    "/aboutus",
    "/module/addExercise",
    "/profile",
    "/users",
    "/users/userDetail",
    "/addexcel",
    "/affirmation",
    "/category",
    "/category/theme",
    "/module/addMcqExercise",

  ],
};

