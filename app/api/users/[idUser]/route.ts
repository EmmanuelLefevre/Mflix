import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
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
 *     summary: Delete a user by Id
 *     description: Deletes the user with the specified ObjectId.
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
 *       204:
 *         description: Successfully deleted the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 204
 *                 message:
 *                   type: string
 *                   example: "User deleted"
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
 *                   example: "Invalid user ObjectID parameter format"
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

    const db = await MongoDBSingleton.getDbInstance();

    const collectionExists = await checkCollectionExists(db, "users");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'users' not found" },
        { status: 404 }
      );
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

    return NextResponse.json(
      { status: 204, message: 'User deleted' },
      { status: 204 }
    );
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
