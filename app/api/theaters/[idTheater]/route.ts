import { NextRequest, NextResponse } from 'next/server';
import MongoDBSingleton from '@/lib/mongodb';
import { ObjectId } from 'mongodb';


/**
 * @swagger
 * /api/theaters/{ObjectId}:
 *   get:
 *     summary: Retrieve a specific theater by its ObjectId
 *     description: Fetches a theater based on the provided ObjectId.
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         schema:
 *           type: string
 *           example: "59a47287cfa9a3a73e51e9d7"
 *         description: The ObjectId of the theater to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the theater.
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
 *         description: Invalid request parameters
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
 *                   example: "Invalid ObjectId format"
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
export async function GET(req: NextRequest, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {

    if (req.method !== 'GET') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid theater ObjectId format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes('theaters')) {
      return NextResponse.json(
        { status: 404, error: "Collection 'theaters' not found" },
        { status: 404 }
      );
    }

    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json(
        { status: 404, error: 'Theater not found' },
        { status: 404 }
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
 * /api/theaters/{ObjectId}:
 *   put:
 *     summary: Update a specific theater by its ObjectId
 *     description: Updates the details of a theater based on the provided ObjectId.
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         schema:
 *           type: string
 *           example: "59a47287cfa9a3a73e51e9d7"
 *         description: The ObjectId of the theater to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Theater'
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
 *                     - "Location is required and must be an object"
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
export async function PUT(req: NextRequest, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    if (req.method !== 'PUT') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid theater ObjectID parameter format' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { location } = body;

    if (!location || typeof location !== 'object') {
      return NextResponse.json(
        { status: 400, error: 'Location is required and must be an object' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes('theaters')) {
      return NextResponse.json(
        { status: 404, error: "Collection 'theaters' not found" },
        { status: 404 }
      );
    }

    const result = await db.collection('theaters').updateOne(
      { _id: new ObjectId(idTheater) },
      { $set: { location } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: 404, error: 'Theater not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, message: 'Theater updated', data: { _id: idTheater, location } },
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
 * /api/theaters/{ObjectId}:
 *   delete:
 *     summary: Delete a specific theater by its ObjectId
 *     description: Deletes the theater with the specified ObjectId.
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         schema:
 *           type: string
 *           example: "63f5b5fa6e7f16cdd60ab2a9"
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
export async function DELETE(req: NextRequest, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    if (req.method !== 'DELETE') {
      return NextResponse.json(
        { status: 405, error: 'Method Not Allowed' },
        { status: 405 }
      );
    }

    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid theater ObjectId format' },
        { status: 400 }
      );
    }

    const db = await MongoDBSingleton.getDbInstance();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (!collectionNames.includes('theaters')) {
      return NextResponse.json(
        { status: 404, error: "Collection 'theaters' not found" },
        { status: 404 }
      );
    }

    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

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

