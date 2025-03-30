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
 *         description: Successfully logout the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
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
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
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
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: "No token provided"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example:
 *                   - "Collection 'sessions' not found"
 *                   - "Session not found or already deleted"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example:
 *                     - "Unexpected error occurred."
 *                     - errorMessage
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!token && !refreshToken) {
      return NextResponse.json(
        { status: 400, error: "No token found in cookies" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { status: 401, error: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    if (!decodedToken || !decodedToken.username) {
      return NextResponse.json(
        { status: 400, error: "Unable to extract user information from token" },
        { status: 400 }
      );
    }

    const username = decodedToken.username;

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes("sessions")) {
      return NextResponse.json(
        { status: 404, error: "Collection 'sessions' not found" },
        { status: 404 }
      );
    }

    const sessionDeleted = await deleteUserJWT(db, token, refreshToken);
    if (!sessionDeleted) {
      return NextResponse.json(
        { status: 404, error: "Session not found or already deleted" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { status: 200, message: `Au revoir ${username} 👋` },
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
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { status: 500, error: errorMessage },
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
