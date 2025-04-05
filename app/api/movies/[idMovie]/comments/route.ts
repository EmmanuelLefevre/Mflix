import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { MovieRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/*===============================================================*/
/*============ GET ALL COMMENTS FOR A SPECIFIC MOVIE ============*/
/*===============================================================*/
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
        { status: 200, data: [], message: "No comments found" },
        { status: 200 }
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

/*===============================================================*/
/*============ CREATE A COMMENT FOR A SPECIFIC MOVIE ============*/
/*===============================================================*/
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
