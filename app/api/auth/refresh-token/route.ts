import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import MongoDBSingleton from "@/lib/mongodb";
import { JWT_SECRET, REFRESH_SECRET } from "@/lib/jwt-secrets-config";
import { checkCollectionExists } from "@/lib/check-collection-exists";


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
        { status: 400, error: "No refresh token provided" },
        { status: 400 }
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
          { status: 404, error: `Collection '${collection}' not found` },
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
