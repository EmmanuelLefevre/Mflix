import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import jwt from "jsonwebtoken";

import MongoDBSingleton from '@/lib/mongodb';
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

    const token = req.cookies.get("token")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!token && !refreshToken) {
      return NextResponse.json(
        { status: 400, error: "No tokens found in cookies" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { status: 400, error: "No token provided" },
        { status: 400 }
      );
    }

    if (!refreshToken) {
      return NextResponse.json(
        { status: 400, error: "No refreshToken provided" },
        { status: 400 }
      );
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { user_id: string, name: string };
    }
    catch (error) {
      return NextResponse.json(
        { status: 401, error: "Invalid token" },
        { status: 401 }
      );
    }

    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(refreshToken, REFRESH_SECRET) as { user_id: string };
    }
    catch (error) {
      return NextResponse.json(
        { status: 401, error: "Invalid refreshToken" },
        { status: 401 }
      );
    }

    if (!decodedToken.name) {
      return NextResponse.json(
        { status: 400, error: "Unable to extract user information from token" },
        { status: 400 }
      );
    }

    const username = decodedToken.name;
    const userIdFromToken = decodedToken.user_id;

    if (!userIdFromToken) {
      return NextResponse.json(
        { status: 400, error: "No user ID found in token" },
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
      .collection('users')
      .findOne({ _id: new ObjectId(userIdFromToken) })

    if (!user) {
      return NextResponse.json(
        { status: 404, error: "User not found" },
        { status: 404 }
      );
    }

    const idUser = user._id.toString();

    if (idUser !== userIdFromToken) {
      return NextResponse.json(
        { status: 403, error: "You can only disconnect your own account" },
        { status: 403 }
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
      { status: 200, message: `See you later ${username} 👋` },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(0),
      sameSite: "strict"
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(0),
      sameSite: "strict"
    });

    await MongoDBSingleton.destroyDbInstance();

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
