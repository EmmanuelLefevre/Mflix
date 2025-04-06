import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import MongoDBSingleton from "@/lib/mongodb";
import { JWT_SECRET, REFRESH_SECRET } from "@/lib/jwt-secrets-config";
import { checkCollectionExists } from "@/lib/check-collection-exists";


export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const existingToken = req.cookies.get("token")?.value;

    if (existingToken) {
      return NextResponse.json(
        { status: 409, error: "User already authenticated" },
        { status: 409 }
      );
    }

    const { email, password } = await req.json();


    const errors: string[] = [];

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

    const user = await db
      .collection("users")
      .findOne({ email });

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
      { user_id: user._id.toString(), email, name: user.name },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { user_id: user._id.toString(), email, name: user.name },
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
      { status: 200, message: `Hello ${user.name} 👋` },
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
