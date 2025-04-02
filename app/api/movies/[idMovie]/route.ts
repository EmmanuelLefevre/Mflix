import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { MovieRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * /api/movies/{Id}:
 *   get:
 *     summary: Retrieve a movie by Id
 *     description: Fetches a movie based on the provided ObjectId.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "573a1390f29313caabcd446f"
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
 *         description: Bad request
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
 *                   example: "Invalid movie ObjectId parameter format"
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
export async function GET(req: NextRequest, { params }: MovieRouteContext): Promise<NextResponse> {
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
        { status: 400, error: 'Invalid movie ObjectId parameter format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collectionExists = await checkCollectionExists(db, "movies");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'movies' not found" },
        { status: 404 }
      );
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
 * /api/movies/{Id}:
 *   put:
 *     summary: Update a movie by Id
 *     description: Updates the details of a movie based on the provided ObjectId.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "573a1390f29313caabcd446f"
 *         description: The ObjectId of the movie to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plot:
 *                 type: string
 *                 example: "A group of bandits stage a brazen train hold-up..."
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Short", "Western"]
 *               runtime:
 *                 type: integer
 *                 example: 11
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A.C. Abadie", "Gilbert M. 'Broncho Billy' Anderson"]
 *               num_mflix_comments:
 *                 type: integer
 *                 example: 0
 *               title:
 *                 type: string
 *                 example: "The Great Train Robbery"
 *               fullplot:
 *                 type: string
 *                 example: "Among the earliest existing films in American cinema..."
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["English"]
 *               released:
 *                 type: string
 *                 format: date-time
 *                 example: "1903-12-01T00:00:00.000+00:00"
 *               directors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Edwin S. Porter"]
 *               rated:
 *                 type: string
 *                 example: "TV-G"
 *               awards:
 *                 type: object
 *                 properties:
 *                   wins:
 *                     type: integer
 *                     example: 1
 *                   nominations:
 *                     type: integer
 *                     example: 0
 *                   text:
 *                     type: string
 *                     example: "1 win."
 *               lastupdated:
 *                 type: string
 *                 example: "2015-08-13 00:27:59.177000000"
 *               year:
 *                 type: integer
 *                 example: 1903
 *               imdb:
 *                 type: object
 *                 properties:
 *                   rating:
 *                     type: number
 *                     example: 7.4
 *                   votes:
 *                     type: integer
 *                     example: 9847
 *                   id:
 *                     type: integer
 *                     example: 439
 *               countries:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["USA"]
 *               type:
 *                 type: string
 *                 example: "movie"
 *               tomatoes:
 *                 type: object
 *                 properties:
 *                   viewer:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: number
 *                         example: 3.7
 *                       numReviews:
 *                         type: integer
 *                         example: 2559
 *                       meter:
 *                         type: integer
 *                         example: 75
 *                       fresh:
 *                         type: integer
 *                         example: 6
 *                   critic:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: number
 *                         example: 7.6
 *                       numReviews:
 *                         type: integer
 *                         example: 6
 *                       meter:
 *                         type: integer
 *                         example: 100
 *                       rotten:
 *                         type: integer
 *                         example: 0
 *               poster:
 *                 type: string
 *                 example: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYt..."
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
export async function PUT(req: NextRequest, { params }: MovieRouteContext): Promise<NextResponse> {
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

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { status: 400, error: 'Request body is required and must be an object' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collectionExists = await checkCollectionExists(db, "movies");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'movies' not found" },
        { status: 404 }
      );
    }

    const result = await db
      .collection('movies')
      .updateOne(
        { _id: new ObjectId(idMovie) },
        { $set: body }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    const updatedMovie = await db
      .collection('movies')
      .findOne({ _id: new ObjectId(idMovie) });

    return NextResponse.json(
      { status: 200, message: 'Movie updated', data: { _id: idMovie, updatedMovie } },
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
 * /api/movies/{Id}:
 *   delete:
 *     summary: Delete a movie by Id
 *     description: Deletes the movie with the specified ObjectId.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "63f5b5fa6e7f16cdd60ab2a9"
 *         description: The ObjectId of the movie to delete.
 *     responses:
 *       204:
 *         description: No Content - Successfully deleted the movie.
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
export async function DELETE(req: NextRequest, { params }: MovieRouteContext): Promise<NextResponse> {
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
        { status: 400, error: 'Invalid movie ObjectId parameter format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collectionExists = await checkCollectionExists(db, "movies");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'movies' not found" },
        { status: 404 }
      );
    }

    const result = await db
      .collection('movies')
      .deleteOne({ _id: new ObjectId(idMovie) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 204, message: 'Movie deleted' },
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

