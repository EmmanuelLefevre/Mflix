import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import MongoDBSingleton from "@/lib/mongodb";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("⚠️ JWT_SECRET or/and REFRESH_SECRET are missing from environment variables !");
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticates a user and returns JWT tokens.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "neo@matrix.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Matrix1999!"
 *     responses:
 *       200:
 *         description: Successfully authenticated the user.
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
 *                   example: "Bienvenue Neo 👋"
 *                 jwt:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: Bad Request - Missing required fields.
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
 *                   example: "Username, email, and password are required"
 *       401:
 *         description: Unauthorized - Invalid credentials.
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
 *                   example: "Invalid username or password"
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
 *                   - "Collection 'users' not found"
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
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: 400, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes("users")) {
      return NextResponse.json(
        { status: 404, error: "Collection 'users' not found" },
        { status: 404 }
      );
    }
    if (!collectionNames.includes("sessions")) {
      return NextResponse.json(
        { status: 404, error: "Collection 'sessions' not found" },
        { status: 404 }
      );
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { status: 401, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { status: 401, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { email, username: user.name },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { email, username: user.name },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const session = {
      user_id: user._id.toString(),
      jwt: token,
      refreshToken: refreshToken
    };

    const sessionResult = await db.collection("sessions").updateOne(
      { user_id: user._id.toString() },
      { $set: session },
      { upsert: true }
    );

    if (!sessionResult.acknowledged) {
      return NextResponse.json(
        { status: 500, error: "Session creation failed" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { status: 200, message: `Bonjour ${user.name} 👋`, jwt: token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
      sameSite: "strict"
    });
    response.cookies.set("refreshToken", refreshToken, {
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
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
