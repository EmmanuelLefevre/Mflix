import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and destroy session
 *     description: Clears authentication cookies and removes user session.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       400:
 *         description: No active session found.
 *       500:
 *         description: Internal server error.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!token && !refreshToken) {
      return NextResponse.json({ message: "No active session" }, { status: 400 });
    }

    // Implémenter la méthode !!!
    // const sessionDeleted = await deleteSessionFromDB(token);

    // if (!sessionDeleted) {
    //   return NextResponse.json({ message: "Error deleting session" }, { status: 500 });
    // }

    const response = NextResponse.json({ message: "Logged out" });

    response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
    response.cookies.set("refreshToken", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

    return response;
  }
  catch (error) {
    let errorMessage = "Unexpected error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
