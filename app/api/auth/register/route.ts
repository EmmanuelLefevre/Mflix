import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import MongoDBSingleton from "@/lib/mongodb";
import { JWT_SECRET, REFRESH_SECRET } from "@/lib/jwt-secrets-config";
import { checkCollectionExists } from "@/lib/check-collection-exists";


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
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
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
 *                   example: "Thank you ${name} for creating an account 😍"
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
 *                   example:
 *                     - "Email is required and must be a string"
 *                     - "Password is required and must be a string"
 *                     - "Name is required and must be a string"
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
    if (req.method !== 'POST') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { name, email, password } = await req.json();


    const errors: string[] = [];

    if (!name || typeof name !== "string") {
      errors.push("Name is required and must be a string");
    }

    if (!email || typeof email !== "string") {
      errors.push("Email is required and must be a string");
    }

    if (!password || typeof password !== "string") {
      errors.push("Password is required and must be a string");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { status: 400, errors },
        { status: 400 }
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

    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      return NextResponse.json(
        { status: 409, error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: name,
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
      { email, name },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { email, name },
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
      { status: 201, message: `Thank you ${name} for creating an account 😍` },
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
