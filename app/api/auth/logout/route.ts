import { NextRequest, NextResponse } from "next/server";
import MongoDBSingleton from '@/lib/mongodb';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and destroy session
 *     description: Logs out the user by deleting their session from the database and clearing authentication cookies.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 *       404:
 *         description: Session not found or already deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session not found or already deleted"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unexpected error occurred."
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!token && !refreshToken) {
      return NextResponse.json(
        { message: "No active session" },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const sessionDeleted = await deleteUserJWT(db, token, refreshToken);
    if (!sessionDeleted) {
      return NextResponse.json(
        { error: "Session not found or already deleted" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { message: "Logged out" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 0,
      sameSite: "strict"
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 0,
      sameSite: "strict"
    });

    await MongoDBSingleton.destroyDbInstance();

    return response;
  }
  catch (error) {
    let errorMessage = "Unexpected error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Function that deletes session from the database based on the provided tokens.
 * @param db - Instance of the MongoDB database.
 * @param token - User's token to identify the session.
 * @param refreshToken - User's refresh token to identify the session..
 * @returns true if the session was deleted, otherwise false.
 */
async function deleteUserJWT(db: any, token: string | undefined, refreshToken: string | undefined): Promise<boolean> {
  try {
    const sessionsCollection = db.collection('sessions');

    const session = await sessionsCollection.findOne({ jwt: token });

    if (session) {
      await sessionsCollection.deleteOne({ jwt: token });
      return true;
    }

    return false;
  }
  catch (error) {
    console.error('Error deleting session from DB:', error);
    return false;
  }
}
