import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/*========================================*/
/*============ GET ALL MOVIES ============*/
/*========================================*/
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
        { status: 200, data: [], message: "No movies found" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: 200, data: movies },
      { status: 200 }
    );
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}

/*========================================*/
/*============ CREATE A MOVIE ============*/
/*========================================*/
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
