import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { MovieRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/*============================================*/
/*============ GET A SINGLE MOVIE ============*/
/*============================================*/
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
        { status: 200, data: [], message: 'Movie not found' },
        { status: 200 }
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

/*===============================================*/
/*============ MODIFY A SINGLE MOVIE ============*/
/*===============================================*/
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

/*===============================================*/
/*============ DELETE A SINGLE MOVIE ============*/
/*===============================================*/
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

