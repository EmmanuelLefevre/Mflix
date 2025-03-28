import { NextRequest, NextResponse } from "next/server";
import MongoDBSingleton from '@/lib/mongodb';

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

    const db = await MongoDBSingleton.getDbInstance();

    const sessionDeleted = await deleteJWTFromDB(db, token, refreshToken);
    if (!sessionDeleted) {
      return NextResponse.json({ message: "Error deleting session" }, { status: 500 });
    }

    const response = NextResponse.json({ message: "Logged out" });

    response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
    response.cookies.set("refreshToken", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

    await MongoDBSingleton.destroyDbInstance();

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

/**
 * Function that deletes session from the database based on the provided tokens.
 * @param db - Instance of the MongoDB database.
 * @param token - User's token to identify the session.
 * @param refreshToken - User's refresh token to identify the session..
 * @returns true if the session was deleted, otherwise false.
 */
async function deleteJWTFromDB(db: any, token: string | undefined, refreshToken: string | undefined): Promise<boolean> {
  try {
    const sessionsCollection = db.collection('sessions');

    const session = await sessionsCollection.findOne({
      $or: [
        { token },
        { refreshToken }
      ]
    });

    if (session) {
      await sessionsCollection.deleteOne({
        $or: [
          { token },
          { refreshToken }
        ]
      });
      return true;
    }

    return false;
  }
  catch (error) {
    console.error('Error deleting session from DB:', error);
    return false;
  }
}
