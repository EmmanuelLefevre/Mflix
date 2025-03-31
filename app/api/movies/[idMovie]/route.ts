import { NextRequest, NextResponse } from 'next/server';
import MongoDBSingleton from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { MoviesRouteContext } from '@/lib/interfaces/api-interfaces';


/**
 * @swagger
 * /api/movies/{ObjectId}:
 *   get:
 *     summary: Retrieve a specific movie by its ObjectId
 *     description: Fetches a movie based on the provided ObjectId.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         schema:
 *           type: string
 *           example: "59a47287cfa9a3a73e51e9d7"
 *         description: The ObjectId of the movie to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid request parameters
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
 *                   example: "Invalid movie ObjectId format"
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
 *                   example:
 *                     - "Unexpected error occurred."
 *                     - errorMessage
*/
export async function GET(req: NextRequest, { params }: MoviesRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie } = await params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid movie ObjectId format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes('movies')) {
      return NextResponse.json(
        { status: 404, error: "Collection 'movies' not found" },
        { status: 404 }
      );
    }

    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, data: movie },
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
 * /api/movies/{ObjectId}:
 *   put:
 *     summary: Update a specific movie by its ObjectId
 *     description: Updates the details of a movie based on the provided ObjectId.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         schema:
 *           type: string
 *           example: "59a47287cfa9a3a73e51e9d7"
 *         description: The ObjectId of the movie to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Successfully updated the movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
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
 *                     - "Location is required and must be an object"
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
 *                     - "Collection 'movies' not found"
 *                     - "Movienot found"
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
export async function PUT(req: NextRequest, { params }: MoviesRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'PUT') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie } = await params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid movie ObjectID parameter format' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { location } = body;

    if (!location || typeof location !== 'object') {
      return NextResponse.json(
        { status: 400, error: 'Location is required and must be an object' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes('movies')) {
      return NextResponse.json(
        { status: 404, error: "Collection 'movies' not found" },
        { status: 404 }
      );
    }

    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(idMovie) },
      { $set: { location } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, message: 'Movie updated', data: { _id: idMovie, location } },
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
 * /api/movies/{ObjectId}:
 *   delete:
 *     summary: Delete a specific movie by its ObjectId
 *     description: Deletes the movie with the specified ObjectId.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         schema:
 *           type: string
 *           example: "63f5b5fa6e7f16cdd60ab2a9"
 *         description: The ObjectId of the movie to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the movie.
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
 *                   example: "Movie deleted"
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
 *                   example: "Invalid movie ObjectID parameter format"
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
 *                   example:
 *                     - "Unexpected error occurred."
 *                     - errorMessage
*/
export async function DELETE(req: NextRequest, { params }: MoviesRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'DELETE') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idMovie } = await params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid movie ObjectId format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes('movies')) {
      return NextResponse.json(
        { status: 404, error: "Collection 'movies' not found" },
        { status: 404 }
      );
    }

    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, message: 'Movie deleted' },
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

