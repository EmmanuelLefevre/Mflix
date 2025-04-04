import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "573a1390f29313caabcd42e8"
 *         plot:
 *           type: string
 *           example: "A group of bandits stage a brazen train hold-up..."
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Short", "Western"]
 *         runtime:
 *           type: integer
 *           example: 11
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *           example: ["A.C. Abadie", "Gilbert M. 'Broncho Billy' Anderson"]
 *         num_mflix_comments:
 *           type: integer
 *           example: 0
 *         title:
 *           type: string
 *           example: "The Great Train Robbery"
 *         fullplot:
 *           type: string
 *           example: "Among the earliest existing films in American cinema..."
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: ["English"]
 *         released:
 *           type: string
 *           format: date-time
 *           example: "1903-12-01T00:00:00.000+00:00"
 *         directors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Edwin S. Porter"]
 *         rated:
 *           type: string
 *           example: "TV-G"
 *         awards:
 *           type: object
 *           properties:
 *             wins:
 *               type: integer
 *               example: 1
 *             nominations:
 *               type: integer
 *               example: 0
 *             text:
 *               type: string
 *               example: "1 win."
 *         lastupdated:
 *           type: string
 *           example: "2015-08-13 00:27:59.177000000"
 *         year:
 *           type: integer
 *           example: 1903
 *         imdb:
 *           type: object
 *           properties:
 *             rating:
 *               type: number
 *               example: 7.4
 *             votes:
 *               type: integer
 *               example: 9847
 *             id:
 *               type: integer
 *               example: 439
 *         countries:
 *           type: array
 *           items:
 *             type: string
 *           example: ["USA"]
 *         type:
 *           type: string
 *           example: "movie"
 *         tomatoes:
 *           type: object
 *           properties:
 *             viewer:
 *               type: object
 *               properties:
 *                 rating:
 *                   type: number
 *                   example: 3.7
 *                 numReviews:
 *                   type: integer
 *                   example: 2559
 *                 meter:
 *                   type: integer
 *                   example: 75
 *                 fresh:
 *                   type: integer
 *                   example: 6
 *             critic:
 *               type: object
 *               properties:
 *                 rating:
 *                   type: number
 *                   example: 7.6
 *                 numReviews:
 *                   type: integer
 *                   example: 6
 *                 meter:
 *                   type: integer
 *                   example: 100
 *                 rotten:
 *                   type: integer
 *                   example: 0
 *         poster:
 *           type: string
 *           example: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYt..."
*/

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retrieve movies with pagination and limit
 *     description: Returns a paginated/limited list of movies from the database.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Number of movies to return (between 1 and 50, default is 10)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination (default is 1)
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of movies. Returns an empty array if no movies are found.
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
 *                     $ref: '#/components/schemas/Movie'
 *             examples:
 *               success:
 *                 summary: Movies found
 *                 value:
 *                   status: 200
 *                   data:
 *                     - _id: "573a1390f29313caabcd446f"
 *                       title: "The Great Train Robbery"
 *                       plot: "A group of bandits stage a brazen train hold-up..."
 *                       genres: ["Short", "Western"]
 *                       runtime: 11
 *                       cast:
 *                         - "A.C. Abadie"
 *                         - "Gilbert M. 'Broncho Billy' Anderson"
 *                       num_mflix_comments: 0
 *                       fullplot: "Among the earliest existing films in American cinema..."
 *                       languages: ["English"]
 *                       released: "1903-12-01T00:00:00.000+00:00"
 *                       directors: ["Edwin S. Porter"]
 *                       rated: "TV-G"
 *                       awards:
 *                         wins: 1
 *                         nominations: 0
 *                         text: "1 win."
 *                       lastupdated: "2015-08-13 00:27:59.177000000"
 *                       year: 1903
 *                       imdb:
 *                         rating: 7.4
 *                         votes: 9847
 *                         id: 439
 *                       countries: ["USA"]
 *                       type: "movie"
 *                       tomatoes: {}
 *                       viewer:
 *                         rating: 3.7
 *                         numReviews: 2559
 *                         meter: 75
 *                         fresh: 6
 *                       critic:
 *                         rating: 7.6
 *                         numReviews: 6
 *                         meter: 100
 *                         rotten: 0
 *                       poster: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYt..."
 *                     - _id: "573a1392f29313caabcda70a"
 *                       title: "Black Fury"
 *                       plot: "An immigrant coal miner finds himself in the middle of a bitter labor …"
 *                       genres: ["Crime", "Drama", "Romance"]
 *                       runtime: 94
 *                       rated: "APPROVED"
 *                       cast:
 *                         - "Paul Muni"
 *                         - "Karen Morley"
 *                         - "William Gargan"
 *                         - "Barton MacLane"
 *                       poster: "https://m.media-amazon.com/images/M/MV5BMTQwMzU0NDY0NV5BMl5BanBnXkFtZT…"
 *                       fullplot: "An immigrant coal miner finds himself in the middle of a bitter labor …"
 *                       languages: ["English"]
 *                       released: "1935-05-18T00:00:00.000+00:00"
 *                       directors: ["Michael Curtiz"]
 *                       writers:
 *                         - "Abem Finkel (screen play)"
 *                         - "Carl Erickson (screen play)"
 *                         - "Michael A. Musmanno (original story 'Jan Volkanik')"
 *                         - "Harry R. Irving (play)"
 *                       awards:
 *                         wins: 0
 *                         nominations: 2
 *                         text: "Nominated for 1 Oscar. Another 1 nomination."
 *                       lastupdated: "2015-09-17 04:41:44.297000000"
 *                       year: 1935
 *                       imdb:
 *                         rating: 6.7
 *                         votes: 511
 *                         id: 26121
 *                       countries: ["USA"]
 *                       type: "movie"
 *                       tomatoes: {}
 *                       viewer:
 *                         rating: 1
 *                         numReviews: 40
 *                       dvd: "2008-01-15T00:00:00.000+00:00"
 *                       lastUpdated: "2015-08-22T19:10:15.000+00:00"
 *                       num_mflix_comments: 0
 *               no_movies:
 *                 summary: No movies found
 *                 value:
 *                   status: 200
 *                   data: []
 *                   message: "No movies found"
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
 *                   example: "Invalid query parameters"
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
 *                   example: "Collection 'movies' not found"
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
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit")) || 10;
    const page = Number(url.searchParams.get("page")) || 1;

    if (limit < 1 || limit > 50 || page < 1) {
      return NextResponse.json(
        { status: 400, error: "Invalid query parameters" },
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

    const movies = await db
      .collection('movies')
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    if (movies.length === 0) {
      return NextResponse.json(
        { status: 200, message: "No movies found" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: 200, data: movies },
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
 * /api/movies:
 *   post:
 *     summary: Register a new movie
 *     description: Inserts a new movie into the movies collection.
 *     tags:
 *       - Movies
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
 *       201:
 *         description: Successfully added the movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
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
 *                     - "Title is required and must be a string"
 *                     - "Year is required and must be a number"
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
 *         description: Conflict - Movie already exists.
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
 *                   example: "Movie already exists"
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
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const body = await req.json();
    const { title, year, ...rest } = body;

    const errors: string[] = [];

    if (!title || typeof title !== "string") {
      errors.push("Title is required and must be a string");
    }

    if (!year || typeof year !== "number") {
      errors.push("Year is required and must be a number");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { status: 400, errors },
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

    const existingMovie = await db
      .collection('movies')
      .findOne({ title, year });

    if (existingMovie) {
      return NextResponse.json(
        { status: 409, error: 'Movie already exists' },
        { status: 409 }
      );
    }

    const movie = { title, year, ...rest };
    movie._id = new ObjectId();

    const result = await db
      .collection('movies')
      .insertOne(movie);

    return NextResponse.json(
      { status: 201, message: 'Movie created', data: { _id: result.insertedId, title, year, ...rest } },
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
