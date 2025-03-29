import { NextResponse } from 'next/server';
import MongoDBSingleton from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retrieve the entire list of movies
 *     description: Returns the full catalog of movies available in the database, limited to 10 results.
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of movies.
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "573a1390f29313caabcd42e8"
 *                       title:
 *                         type: string
 *                         example: "The Great Train Robbery"
 *                       plot:
 *                         type: string
 *                         example: "A group of bandits stage a brazen train hold-up..."
 *                       fullplot:
 *                         type: string
 *                         example: "Among the earliest existing films in American cinema..."
 *                       genres:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Short", "Western"]
 *                       runtime:
 *                         type: integer
 *                         example: 11
 *                       cast:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["A.C. Abadie", "Gilbert M. 'Broncho Billy' Anderson"]
 *                       poster:
 *                         type: string
 *                         example: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYt..."
 *                       languages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["English"]
 *                       released:
 *                         type: string
 *                         format: date-time
 *                         example: "1903-12-01T00:00:00.000+00:00"
 *                       directors:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Edwin S. Porter"]
 *                       rated:
 *                         type: string
 *                         example: "TV-G"
 *                       awards:
 *                         type: object
 *                         properties:
 *                           wins:
 *                             type: integer
 *                             example: 1
 *                           nominations:
 *                             type: integer
 *                             example: 0
 *                           text:
 *                             type: string
 *                             example: "1 win."
 *                       imdb:
 *                         type: object
 *                         properties:
 *                           rating:
 *                             type: number
 *                             example: 7.4
 *                           votes:
 *                             type: integer
 *                             example: 9847
 *                           id:
 *                             type: integer
 *                             example: 439
 *                       countries:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["USA"]
 *                       type:
 *                         type: string
 *                         example: "movie"
 *                       tomatoes:
 *                         type: object
 *                         properties:
 *                           viewer:
 *                             type: object
 *                             properties:
 *                               rating:
 *                                 type: number
 *                                 example: 3.7
 *                               numReviews:
 *                                 type: integer
 *                                 example: 2559
 *                               meter:
 *                                 type: integer
 *                                 example: 75
 *                               fresh:
 *                                 type: integer
 *                                 example: 6
 *                           critic:
 *                             type: object
 *                             properties:
 *                               rating:
 *                                 type: number
 *                                 example: 7.6
 *                               numReviews:
 *                                 type: integer
 *                                 example: 6
 *                               meter:
 *                                 type: integer
 *                                 example: 100
 *                               rotten:
 *                                 type: integer
 *                                 example: 0
 *                       lastupdated:
 *                         type: string
 *                         example: "2015-08-13 00:27:59.177000000"
 *                       num_mflix_comments:
 *                         type: integer
 *                         example: 0
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Collection 'movies' not found"
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
 *                 message:
 *                   type: string
 *                   example:
 *                     - "Unexpected error occurred."
 *                     - errorMessage
 */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes('movies')) {
      return NextResponse.json(
        { error: "Collection 'movies' not found" },
        { status: 404 }
      );
    }

    const movies = await db.collection('movies').find({}).limit(10).toArray();

    return NextResponse.json({
      data: movies,
      status: 200
    });
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
