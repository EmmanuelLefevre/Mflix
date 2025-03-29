import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import MongoDBSingleton from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("⚠️ JWT_SECRET is missing from environment variables!");
}

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
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Au revoir Neo 👋"
 *       400:
 *         description: Bad Request - Unable to extract user information from token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example:
 *                     - "No token found in cookies"
 *                     - "Unable to extract user information from token"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided"
 *       404:
 *         description: Not Found - Session not found or already deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session not found or already deleted"
 *       500:
 *         description: Internal Server Error.
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
        { message: "No token found in cookies" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    if (!decodedToken || !decodedToken.username) {
      return NextResponse.json(
        { message: "Unable to extract user information from token" },
        { status: 400 }
      );
    }

    const username = decodedToken.username;

    const db = await MongoDBSingleton.getDbInstance();

    const sessionDeleted = await deleteUserJWT(db, token, refreshToken);
    if (!sessionDeleted) {
      return NextResponse.json(
        { error: "Session not found or already deleted" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { message: `Au revoir ${username} 👋` },
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

      if (refreshToken) {
        await sessionsCollection.deleteOne({ refreshToken });
      }

      return true;
    }

    return false;
  }
  catch (error) {
    console.error('Error deleting session from DB:', error);
    return false;
  }
}
