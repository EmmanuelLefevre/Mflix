import { NextResponse } from 'next/server';
import MongoDBSingleton from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retrieve the entire list of movies
 *     description: Returns the full catalog of movies available in the database.
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of movies.
 *       500:
 *         description: Internal Server Error.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await MongoDBSingleton.getDbInstance();
    const movies = await db.collection('movies').find({}).limit(10).toArray();

    return NextResponse.json({
      status: 200,
      data: movies
    });
  }
  catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}
