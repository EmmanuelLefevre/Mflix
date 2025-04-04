import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import MongoDBSingleton from '@/lib/mongodb';
import { TheaterRouteContext } from '@/lib/interfaces/api-interfaces';
import { checkCollectionExists } from "@/lib/check-collection-exists";


/**
 * @swagger
 * /api/theaters/{Id}:
 *   get:
 *     summary: Retrieve a theater by Id
 *     description: Fetches a theater based on the provided ObjectId.
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "59a47286cfa9a3a73e51e72d"
 *         description: The ObjectId of the theater to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the theater. Returns an empty array if no theater is found.
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
 *                 summary: Theater found
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
 *               no_theater:
 *                 summary: Theater not found
 *                 value:
 *                   status: 200
 *                   data: []
 *                   message: "Theater not found"
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
 *                   example: "Invalid theater ObjectId parameter format"
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
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/theaters/{Id}:
 *   put:
 *     summary: Update a theater by Id
 *     description: Updates the details of a theater based on the provided ObjectId.
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "59a47286cfa9a3a73e51e72d"
 *         description: The ObjectId of the theater to update.
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
 *       200:
 *         description: Successfully updated the theater.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
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
 *                     - "Invalid theater ObjectID parameter format"
 *                     - "Request body is required and must be an object"
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
 *                   example:
 *                     - "Collection 'theaters' not found"
 *                     - "Theater not found"
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

    if (!body || typeof body !== 'object') {
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
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/theaters/{Id}:
 *   delete:
 *     summary: Delete a theater by Id
 *     description: Deletes the theater with the specified ObjectId.
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *           example: "59a47286cfa9a3a73e51e72d"
 *         description: The ObjectId of the theater to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the theater.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Theater deleted"
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
 *                   example: "Invalid theater ObjectID parameter format"
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
 *                   example:
 *                     - "Collection 'theaters' not found"
 *                     - "Theater not found"
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
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';

    return NextResponse.json(
      { status: 500, error: errorMessage },
      { status: 500 }
    );
  }
}

