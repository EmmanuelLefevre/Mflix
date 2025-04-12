import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { TheaterRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/*==============================================*/
/*============ GET A SINGLE THEATER ============*/
/*==============================================*/
export async function GET(req: NextRequest, { params }: TheaterRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idTheater } = await params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid theater ObjectId parameter format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collectionExists = await checkCollectionExists(db, "theaters");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'theaters' not found" },
        { status: 404 }
      );
    }

    const theater = await db
      .collection('theaters')
      .findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json(
        { status: 200, data: [], message: 'Theater not found' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: 200, data: theater },
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

/*=================================================*/
/*============ MODIFY A SINGLE THEATER ============*/
/*=================================================*/
export async function PUT(req: NextRequest, { params }: TheaterRouteContext): Promise<NextResponse> {
  try {
    if (req.method !== 'PUT') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idTheater } = await params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid theater ObjectID parameter format' },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { status: 400, error: 'Request body is required and must be an object' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collectionExists = await checkCollectionExists(db, "theaters");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'theaters' not found" },
        { status: 404 }
      );
    }

    const result = await db
      .collection('theaters')
      .updateOne(
        { _id: new ObjectId(idTheater) },
        { $set: body }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Theater not found' },
        { status: 404 }
      );
    }

    const updatedTheater = await db
      .collection('theaters')
      .findOne({ _id: new ObjectId(idTheater) });

    return NextResponse.json(
      { status: 200, message: 'Theater updated', data: { _id: idTheater, updatedTheater } },
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

/*=================================================*/
/*============ DELETE A SINGLE THEATER ============*/
/*=================================================*/
export async function DELETE(req: NextRequest, { params }: TheaterRouteContext): Promise<NextResponse> {
  const { idTheater } = await params;

  try {
    if (req.method !== 'DELETE') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid theater ObjectId parameter format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collectionExists = await checkCollectionExists(db, "theaters");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'theaters' not found" },
        { status: 404 }
      );
    }

    const result = await db
      .collection('theaters')
      .deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Theater not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, message: 'Theater deleted' },
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

