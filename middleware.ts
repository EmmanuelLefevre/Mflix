import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

// Liste des routes publiques
const publicRoutes = ["/login", "/logout", "/register", "/refresh-token", "/api-doc"];

export async function middleware(req: NextRequest) {
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token!, SECRET_KEY);
    return NextResponse.next();
  }
  catch (error) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const refreshResponse = await fetch(new URL("/api/auth/refresh", req.url), {
        method: "GET",
        headers: { Cookie: `refreshToken=${refreshToken}` }
      });

      if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const { token: newToken } = await refreshResponse.json();
      const response = NextResponse.next();
      response.cookies.set("token", newToken, { httpOnly: true, secure: true, path: "/" });

      return response;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
