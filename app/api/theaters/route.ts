import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * components:
 *   schemas:
 *     Theater:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f5b5fa6e7f16cdd60ab2a9"
 *         theaterId:
 *           type: integer
 *           example: 1000
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: object
 *               properties:
 *                 street1:
 *                   type: string
 *                   example: "340 W Market"
 *                 street2:
 *                   type: string
 *                   example: "Ste backerstreet"
 *                 city:
 *                   type: string
 *                   example: "Bloomington"
 *                 state:
 *                   type: string
 *                   example: "MN"
 *                 zipcode:
 *                   type: string
 *                   example: "55425"
 *             geo:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: "Point"
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [-93.24565, 44.85466]
*/

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Retrieve theaters with pagination and limit
 *     description: Returns a paginated/limited list of theaters from the database.
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Number of theaters to return (between 1 and 50, default is 10)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination (default is 1)
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of theaters. Returns an empty array if no theaters are found.
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
 *                     $ref: '#/components/schemas/Theater'
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Theaters found
 *                 value:
 *                   status: 200
 *                   data:
 *                     - _id: "59a47286cfa9a3a73e51e72d"
 *                       theaterId: 1003
 *                       location:
 *                         address:
 *                           street1: "340 W Market"
 *                           street2: "Ste backerstreet"
 *                           city: "Bloomington"
 *                           state: "MN"
 *                           zipcode: "55425"
 *                         geo:
 *                           type: "Point"
 *                           coordinates: [-93.24565, 44.85466]
 *                     - _id: "59a47286cfa9a3a73e51e72e"
 *                       theaterId: 1008
 *                       location:
 *                         address:
 *                           street1: "1621 E Monte Vista Ave"
 *                           city: "Vacaville"
 *                           state: "CA"
 *                           zipcode: "95688"
 *                         geo:
 *                           type: "Point"
 *                           coordinates: [-121.96328, 38.367649]
 *               no_theaters:
 *                 summary: No theaters found
 *                 value:
 *                   status: 200
 *                   data: []
 *                   message: "No theaters found"
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
 *                   example: "Collection 'theaters' not found"
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

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Register a new theater
 *     description: Inserts a new theater into the theaters collection.
 *     tags:
 *       - Theaters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: object
 *                     properties:
 *                       street1:
 *                         type: string
 *                         example: "340 W Market"
 *                       street2:
 *                         type: string
 *                         example: "Ste backerstreet"
 *                       city:
 *                         type: string
 *                         example: "Bloomington"
 *                       state:
 *                         type: string
 *                         example: "MN"
 *                       zipcode:
 *                         type: string
 *                         example: "55425"
 *                   geo:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Point"
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [-93.24565, 44.85466]
 *     responses:
 *       201:
 *         description: Successfully added the theater.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Theater'
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
 *                     - "Location is required and must be an object"
 *                     - "Request body is required and must be an object"
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
 *         description: Conflict - Theater already exists.
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
 *                   example: "Theater already exists"
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
