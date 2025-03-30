import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET!;
export const REFRESH_SECRET = process.env.REFRESH_SECRET!;

const publicRoutes = new Set([
  "/login",
  "/register",
  "/refresh-token"
]);

const allowedOrigins = ['http://localhost:3000', 'https://ton-site.com'];


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const res = NextResponse.next();

  const origin = req.headers.get("origin");
  if (allowedOrigins.includes(origin || '')) {
    res.headers.set("Access-Control-Allow-Origin", origin || '*');
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  if (token && refreshToken && pathname !== "/api-doc") {
    return NextResponse.redirect(new URL("/api-doc", req.url));
  }

  if (publicRoutes.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/logout") {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return redirectToLogin(req, "You must be logged in to log out");
    }

    return NextResponse.next();
  }

  if (!token && !refreshToken) {
    return redirectToLogin(req, "Authentication required");
  }

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    }
    catch (error) {
      console.error("JWT invalide ou expiré :", error instanceof Error ? error.message : error);
    }
  }

  if (refreshToken) {
    return await attemptTokenRefresh(req, refreshToken);
  }

  return redirectToLogin(req, "Invalid or expired authentication");
}


/**
 * Attempts to refresh the authentication token using the `refreshToken`. If successful, the new token is set in the cookies. Otherwise, redirects to the login page.
 * @param req - Next.js request object (NextRequest).
 * @param refreshToken - The refresh token used to obtain a new authentication token.
 * @returns A NextResponse with the updated token or a redirect to the login page in case of an error.
 */
async function attemptTokenRefresh(req: NextRequest, refreshToken: string) {
  try {
    const refreshResponse = await fetch(new URL("/api/auth/refresh-token", req.url), {
      method: "GET",
      headers: { Cookie: `refreshToken=${refreshToken}` }
    });

    if (!refreshResponse.ok) {
      return redirectToLogin(req, "Failed to refresh token");
    }

    const { token: newToken } = await refreshResponse.json();
    const response = NextResponse.next();
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict"
    });

    return response;
  }
  catch (error) {
    return redirectToLogin(req, "Error refreshing authentication token");
  }
}


/**
 * Redirects the user to the login page with an error message, typically used when authentication fails.
 * @param req - Next.js request object (NextRequest).
 * @param message - The error message to be displayed or logged.
 * @returns A NextResponse object that redirects to the login page.
 */
function redirectToLogin(req: NextRequest, message: string) {
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("error", message);

  return NextResponse.redirect(loginUrl);
}


export const config = {
  matcher: "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"
};
