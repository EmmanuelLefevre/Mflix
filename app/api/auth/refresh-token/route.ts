import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import MongoDBSingleton from "@/lib/mongodb";
import { JWT_SECRET, REFRESH_SECRET } from "@/lib/jwt-secrets-config";
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * /api/auth/refresh-token:
 *   get:
 *     summary: Refresh authentication token
 *     description: Generates a new JWT access token using a valid refresh token.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully refreshed token.
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
 *                   example: "Token is refreshed"
 *       401:
 *         description: Unauthorized - No refresh token provided or invalid.
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
 *                   example: "No refresh token provided"
 *       403:
 *         description: Forbidden - Invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Invalid refresh token"
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
 *                     - "Collection 'sessions' not found"
 *                     - "Collection 'users' not found"
 *                     - "Session not found"
 *                     - "User not found"
 *       405:
 *         description: Method Not Allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 405
 *                 error:
 *                   type: string
 *                   example: "Method Not Allowed"
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
 *                     - "Unexpected error occurred"
 *                     - errorMessage
 */
export async function GET(req: NextRequest) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { status: 401, error: "No refresh token provided" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    }
    catch (err) {
      return NextResponse.json(
        { status: 403, error: "Invalid refresh token" },
        { status: 403 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const requiredCollections = ["users", "sessions"];
    for (const collection of requiredCollections) {
      if (!(await checkCollectionExists(db, collection))) {
        return NextResponse.json(
          { error: `Collection '${collection}' not found` },
          { status: 404 }
        );
      }
    }

    const session = await db
      .collection("sessions")
      .findOne({ refreshToken });

    if (!session) {
      return NextResponse.json(
        { status: 404, error: "Session not found" },
        { status: 404 }
      );
    }

    const user = await db
      .collection("users")
      .findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json(
        { status: 404, error: "User not found" },
        { status: 404 }
      );
    }

    const newToken = jwt.sign(
      { user_id: user._id.toString(), email: decoded.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "15min" }
    );

    await db
        .collection("sessions")
        .updateOne(
          { refreshToken: session.refreshToken },
          { $set: { jwt: newToken } }
        );

    const response = NextResponse.json(
      { status: 200, message: "Token is refreshed" },
      { status: 200 }
    );

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
      sameSite: "strict"
    });

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
