import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { MovieRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "5a9427648b0beebeb6957a88"
 *         name:
 *           type: string
 *           example: "Thomas Morris"
 *         email:
 *           type: string
 *           example: "thomas_morris@fakegmail.com"
 *         movie_id:
 *           type: string
 *           example: "573a1390f29313caabcd680a"
 *         text:
 *           type: string
 *           example: "Perspiciatis sequi nesciunt maiores. Molestiae earum odio voluptas."
 *         date:
 *           type: string
 *           format: date-time
 *           example: "1995-07-16T01:13:12.000+00:00"
*/

/**
 * @swagger
 * /api/movies/{Id}/comments:
 *   get:
 *     summary: Retrieve comments for a movie
 *     description: Returns a paginated list of comments for a specific movie.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "573a1390f29313caabcd446f"
 *         description: The ObjectID of the movie
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the comments for a specific movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
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
 *                     - "Invalid movie ObjectID parameter format"
 *                     - "Invalid query parameters"
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
 *                     - "No comments found"
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
 *                   example: "Unexpected error occurred"
 */
export async function GET(req: NextRequest, { params }: MovieRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie } = await params;

    console.log(idMovie);

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid movie ObjectID parameter format' },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 50);
    const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);

    if (limit < 1 || limit > 50 || page < 1) {
      return NextResponse.json(
        { status: 400, error: "Invalid query parameters" },
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
    .collection("movies")
    .findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    const comments = await db
      .collection("comments")
      .find({ movie_id: new ObjectId(idMovie) })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    if (comments.length === 0) {
      return NextResponse.json(
        { status: 404, error: "No comments found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, data: comments },
      { status: 200 }
    );
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/movies/{Id}/comments:
 *   post:
 *     summary: Register a new comment for a movie
 *     description: Inserts a new comment into the comments collection for a specific movie.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "573a1390f29313caabcd446f"
 *         description: The ObjectID of the movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Thomas Morris"
 *               email:
 *                 type: string
 *                 example: "thomas_morris@fakegmail.com"
 *               text:
 *                 type: string
 *                 example: "Test first comment"
 *     responses:
 *       201:
 *         description: Successfully added the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
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
 *                     - "Name is required and must be a string"
 *                     - "Email is required and must be a string"
 *                     - "Invalid movie ObjectID parameter format"
 *                     - "Text is required and must be a string"
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
 *                   example: "Unexpected error occurred"
 */
export async function POST(req: NextRequest, { params }: MovieRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie } = await params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400, error: 'Invalid movie ObjectID parameter format' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, text } = body;

    const errors: string[] = [];

    if (!name || typeof name !== "string") {
      errors.push("Name is required and must be a string");
    }

    if (!email || typeof email !== "string") {
      errors.push("Email is required and must be a number");
    }

    if (!text || typeof text !== "string") {
      errors.push("Text is required and must be a string");
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
      .collection("movies")
      .findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    const newComment = {
      _id: new ObjectId(),
      name,
      email,
      movie_id: new ObjectId(idMovie),
      text,
      date: new Date()
    };

    await db
      .collection("comments")
      .insertOne(newComment);

    return NextResponse.json(
      { status: 201, message: 'Comment added', data: newComment },
      { status: 201 }
    );
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
