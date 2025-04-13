import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { CommentRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/*============================================================*/
/*============ GET A COMMENT FOR A SPECIFIC MOVIE ============*/
/*============================================================*/
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
          { status: 404, error: `Collection '${collection}' not found` },
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}

/*===============================================================*/
/*============ MODIFY A COMMENT FOR A SPECIFIC MOVIE ============*/
/*===============================================================*/
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
      errors.push("Invalid movie ObjectId parameter format");
    }

    if (!ObjectId.isValid(idComment)) {
      errors.push("Invalid comment ObjectId parameter format");
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
          { status: 404, error: `Collection '${collection}' not found` },
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}

/*===============================================================*/
/*============ DELETE A COMMENT FOR A SPECIFIC MOVIE ============*/
/*===============================================================*/
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
      errors.push("Invalid movie ObjectId parameter format");
    }

    if (!ObjectId.isValid(idComment)) {
      errors.push("Invalid comment ObjectId parameter format");
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
          { status: 404, error: `Collection '${collection}' not found` },
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}
