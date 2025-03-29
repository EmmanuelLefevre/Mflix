import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import MongoDBSingleton from "@/lib/mongodb";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("⚠️ JWT_SECRET or/and REFRESH_SECRET are missing from environment variables!");
}

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
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       401:
 *         description: Unauthorized - No refresh token provided or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 error:
 *                   type: string
 *                   example:
 *                     - "Session not found"
 *                     - "User not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example:
 *                     - "Unexpected error occurred."
 *                     - errorMessage
 */
export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    }
    catch (err) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 403 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();
    const session = await db.collection("sessions").findOne({ refreshToken });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const user = await db.collection("users").findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const newToken = jwt.sign(
      { email: decoded.email, username: user.name },
      JWT_SECRET,
      { expiresIn: "15min" }
    );

    const newRefreshToken = jwt.sign(
      { email: decoded.email, username: user.name },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await db.collection("sessions").updateOne(
      { refreshToken: session.refreshToken },
      { $set: { refreshToken: newRefreshToken, jwt: newToken } }
    );

    const response = NextResponse.json(
      { token: newToken },
      { status: 200 }
    );

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
      sameSite: "strict"
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict"
    });

    return response;
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
