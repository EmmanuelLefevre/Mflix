import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from "jsonwebtoken";

import MongoDBSingleton from '@/lib/mongodb';
import { JWT_SECRET, REFRESH_SECRET } from "@/lib/jwt-secrets-config";
import { UserRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f5b5fa6e7f16cdd60ab2a9"
 *         name:
 *           type: string
 *           example: "Neo"
 *         email:
 *           type: string
 *           example: "neo@matrix.com"
 *         password:
 *           type: string
 *           example: "Matrix1999!"
*/

/**
 * @swagger
 * /api/users/{Id}:
 *   delete:
 *     summary: Delete a user and associated session by Id
 *     description: Deletes the user and associated session with the specified ObjectId.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "63f5b5fa6e7f16cdd60ab2a9"
 *         description: The ObjectId of the user to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the user and related session.
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
 *                   example: "User and session data deleted"
 *                 farewell:
 *                   type: string
 *                   example: "We will miss you Neo 👋"
 *       400:
 *         description: Bad Request
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
 *                     - "Invalid user ObjectID parameter format"
 *                     - "No refreshToken provided"
 *                     - "No token provided"
 *                     - "No tokens found in cookies"
 *                     - "Unable to extract user information from token"
 *       401:
 *         description: Unauthorized
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
 *                   example:
 *                     - "Invalid refreshToken"
 *                     - "Invalid token"
 *       403:
 *         description: Forbidden
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
 *                   example: "You can only delete your own account"
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
 *                     - "Unexpected error occurred."
 *                     - errorMessage
*/
export async function DELETE(req: NextRequest, { params }: UserRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'DELETE') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idUser } = await params;

    if (!ObjectId.isValid(idUser)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid user ObjectId parameter format' },
        { status: 400 }
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

    const { user_id: userIdFromToken, name } = decodedToken;

    if (idUser !== userIdFromToken.toString()) {
      return NextResponse.json(
        { status: 403, error: "You can only delete your own account" },
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

    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(idUser) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'User not found' },
        { status: 404 }
      );
    }

    try {
      await db
        .collection("sessions")
        .deleteMany({ jwt: token, refreshToken });
    }
    catch (error) {
      console.error("Can't delete session because it's not found or already deleted : ", error);
    }

    const response = NextResponse.json(
      {
        status: 200,
        message: 'User and session data deleted',
        farewell: `We will miss you ${name} 👋`
      },
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
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
