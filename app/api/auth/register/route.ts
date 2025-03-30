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
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user and returns JWT tokens for authentication.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Neo"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "neo@matrix.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Matrix1999!"
 *     responses:
 *       201:
 *         description: Successfully registered and authenticated the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Merci pour la création de compte Neo 😍"
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
 *       409:
 *         description: Conflict - User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 409
 *                 error:
 *                   type: string
 *                   example: "User already exists"
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
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { status: 400, error: "Username, email and password are required" },
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

    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      return NextResponse.json(
        { status: 409, error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: username,
      email: email,
      password: hashedPassword
    };
    const result = await db.collection("users").insertOne(newUser);

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "User registration failed" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { email, username },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { email, username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const session = {
      user_id: result.insertedId.toString(),
      jwt: token,
      refreshToken: refreshToken
    };
    const sessionResult = await db.collection("sessions").insertOne(session);

    if (!sessionResult.acknowledged) {
      return NextResponse.json(
        { status: 500, error: "Session creation failed" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { status: 201, message: `Merci pour la création de compte ${username} 😍`, jwt: token },
      { status: 201}
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
