import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/*==========================================*/
/*============ GET ALL THEATERS ============*/
/*==========================================*/
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

    const collectionExists = await checkCollectionExists(db, "theaters");
    if (!collectionExists) {
      return NextResponse.json(
        { status: 404, error: "Collection 'theaters' not found" },
        { status: 404 }
      );
    }

    const theaters = await db
      .collection('theaters')
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    if (theaters.length === 0) {
      return NextResponse.json(
        { status: 200, data: [], message: "No theaters found" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: 200, data: theaters },
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

/*==========================================*/
/*============ CREATE A THEATER ============*/
/*==========================================*/
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { status: 400, error: 'Request body is required and must be an object' },
        { status: 400 }
      );
    }

    const { location } = body;

    if (!location) {
      return NextResponse.json(
        { status: 400, error: 'Location is required and must be an object' },
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

    const lastTheater = await db
      .collection('theaters')
      .find()
      .sort({ theaterId: -1 })
      .limit(1)
      .toArray();

    const theaterId = lastTheater.length > 0 ? lastTheater[0].theaterId + 1 : 1;

    const theater = {
      theaterId,
      location,
      _id: new ObjectId()
    };

    const result = await db
      .collection('theaters')
      .insertOne(theater);

    return NextResponse.json(
      { status: 201, message: 'Theater created', data: { _id: result.insertedId, theaterId, location } },
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
