import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { CommentRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * /api/movies/{idMovie}/comments/{id}:
 *   get:
 *     summary: Retrieve a comment by Id
 *     description: Fetches a comment based on the provided ObjectId for a specific movie.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *           example: "573a1390f29313caabcd446f"
 *         description: The ObjectId of the related movie.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67eb9bdad83c04fedec747e9"
 *         description: The ObjectId of the comment to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the comment. Returns an empty array if no comment is found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *             examples:
 *               success:
 *                 summary: Comment found
 *                 value:
 *                   status: 200
 *                   data:
 *                     - _id: "5a9427648b0beebeb69579e7"
 *                       name: "Mercedes Tyler"
 *                       email: "mercedes_tyler@fakegmail.com"
 *                       movie_id: "573a1390f29313caabcd4323"
 *                       text: "Eius veritatis vero facilis quaerat fuga temporibus."
 *                       date: "2002-08-18T04:56:07.000+00:00"
 *                     - _id: "5a9427648b0beebeb69579f5"
 *                       name: "John Bishop"
 *                       email: "john_bishop@fakegmail.com"
 *                       movie_id: "573a1390f29313caabcd446f"
 *                       text: "Id error ab at molestias dolorum incidunt."
 *                       date: "1975-01-21T00:31:22.000+00:00"
 *               no_comment:
 *                 summary: Comment not found
 *                 value:
 *                   status: 200
 *                   data: []
 *                   message: "Comment not found"
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
 *                     - "Invalid comment ObjectId parameter format"
 *                     - "Invalid movie ObjectId parameter format"
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
 *                     - "Collection 'comments' not found"
 *                     - "Collection 'movies' not found"
 *                     - "Comment not found for this movie"
 *                     - "Movie not found"
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
export async function GET(req: NextRequest, { params }: CommentRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie, idComment } = await params;

    const errors: string[] = [];

    if (!ObjectId.isValid(idMovie)) {
      errors.push("Invalid movie ObjectId format");
    }

    if (!ObjectId.isValid(idComment)) {
      errors.push("Invalid comment ObjectId format");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { status: 400, errors },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const requiredCollections = ["movies", "comments"];
    for (const collection of requiredCollections) {
      if (!(await checkCollectionExists(db, collection))) {
        return NextResponse.json(
          { error: `Collection '${collection}' not found` },
          { status: 404 }
        );
      }
    }

    const movie = await db
      .collection('movies')
      .findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json(
        { status: 404, data: [], error: 'Movie not found' },
        { status: 404 }
      );
    }

    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(idComment) });

    if (!comment) {
      return NextResponse.json(
        { status: 200, message: 'Comment not found' },
        { status: 200 }
      );
    }

    if (!comment.movie_id.equals(new ObjectId(idMovie))) {
      return NextResponse.json(
        { status: 404, error: 'Comment not found for this movie' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, data: comment },
      { status: 200 }
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

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{id}:
 *   put:
 *     summary: Update a comment by Id
 *     description: Updates the details of a comment for a specific movie based on the provided ObjectId.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *           example: "573a1390f29313caabcd446f"
 *         description: The ObjectId of the related movie.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67eb9bdad83c04fedec747e9"
 *         description: The ObjectId of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Neo"
 *               email:
 *                 type: string
 *                 example: "neo@matrix.com"
 *               text:
 *                 type: string
 *                 example: "Updated test comment"
 *     responses:
 *       200:
 *         description: Successfully updated the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
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
 *                     - "Invalid comment ObjectId parameter format"
 *                     - "Invalid movie ObjectId parameter format"
 *                     - "Request body is required and must be an object"
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
 *                     - "Collection 'comments' not found"
 *                     - "Collection 'movies' not found"
 *                     - "Comment not found"
 *                     - "Comment not found for this movie"
 *                     - "Movie not found"
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
export async function PUT(req: NextRequest, { params }: CommentRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'PUT') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie, idComment } = await params;

    const errors: string[] = [];

    if (!ObjectId.isValid(idMovie)) {
      errors.push("Invalid movie ObjectId format");
    }

    if (!ObjectId.isValid(idComment)) {
      errors.push("Invalid comment ObjectId format");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { status: 400, errors },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { status: 400, error: 'Request body is required and must be an object' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const requiredCollections = ["movies", "comments"];
    for (const collection of requiredCollections) {
      if (!(await checkCollectionExists(db, collection))) {
        return NextResponse.json(
          { error: `Collection '${collection}' not found` },
          { status: 404 }
        );
      }
    }

    const movie = await db
      .collection('movies')
      .findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) });

    if (!comment) {
      return NextResponse.json(
        { status: 404, error: 'Comment not found for this movie' },
        { status: 404 }
      );
    }

    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Comment not found' },
        { status: 404 }
      );
    }

    const updatedComment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(idComment) });

    return NextResponse.json(
      { status: 200, message: 'Comment updated', data: { _id: idComment, updatedComment } },
      { status: 200 }
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

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{id}:
 *   delete:
 *     summary: Delete a comment by Id
 *     description: Deletes a comment associated with a specific movie based on the provided ObjectId.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *           example: "573a1390f29313caabcd446f"
 *         description: The ObjectId of the related movie.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67eb9bdad83c04fedec747e9"
 *         description: The ObjectId of the comment to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the comment.
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
 *                   example: "Comment deleted"
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
 *                     - "Invalid comment ObjectID parameter format"
 *                     - "Invalid movie ObjectID parameter format"
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
 *                     - "Collection 'comments' not found"
 *                     - "Collection 'movies' not found"
 *                     - "Comment not found"
 *                     - "Comment not found for this movie"
 *                     - "Movie not found"
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
export async function DELETE(req: NextRequest, { params }: CommentRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'DELETE') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie, idComment } = await params;

    const errors: string[] = [];

    if (!ObjectId.isValid(idMovie)) {
      errors.push("Invalid movie ObjectId format");
    }

    if (!ObjectId.isValid(idComment)) {
      errors.push("Invalid comment ObjectId format");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { status: 400, errors },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const requiredCollections = ["movies", "comments"];
    for (const collection of requiredCollections) {
      if (!(await checkCollectionExists(db, collection))) {
        return NextResponse.json(
          { error: `Collection '${collection}' not found` },
          { status: 404 }
        );
      }
    }

    const movieExists = await db
      .collection('movies')
      .findOne({ _id: new ObjectId(idMovie) });

    if (!movieExists) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    const commentExists = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie)});

    if (!commentExists) {
      return NextResponse.json(
        { status: 404, error: 'Comment not found for this movie' },
        { status: 404 }
      );
    }

    const result = await db
      .collection('comments')
      .deleteOne({ _id: new ObjectId(idComment) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, message: 'Comment deleted' },
      { status: 200 }
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
