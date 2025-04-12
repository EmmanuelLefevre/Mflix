import { NextRequest } from 'next/server';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from '@/lib/check-collection-exists';

import { GET, POST } from '@/app/api/theaters/route';
import {
  DELETE as DELETE_BY_ID,
  GET as GET_BY_ID,
  PUT as PUT_BY_ID
} from '@/app/api/theaters/[idTheater]/route';


jest.mock('@/lib/mongodb');
jest.mock('@/lib/check-collection-exists');


/*==========================================*/
/*============ GET ALL THEATERS ============*/
/*==========================================*/
describe('GET /api/theaters', () => {
  const mockDbGetAll = {
    collection: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    toArray: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('return 200 with theaters', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);

    const fakeTheaters = [
      {
        _id: "59a47286cfa9a3a73e51e72d",
        theaterId: 2025,
        location: {
          address: {
            street1: "340 W Market",
            street2: "Ste backerstreet",
            city: "Bloomington",
            state: "MN",
            zipcode: "55425"
          },
          geo: {
            type: "Point",
            coordinates: [
              -93.24565,
              44.85466
            ]
          }
        }
      },
      {
        _id: "59a47286cfa9a3a73e51e72e",
        theaterId: 1789,
        location: {
          address: {
            street1: "1621 E Monte Vista Ave",
            city: "Vacaville",
            state: "CA",
            zipcode: "55425"
          },
          geo: {
            type: "Point",
            coordinates: [
              -121.96328,
              38.367649
            ]
          }
        }
      }
    ];

    mockDbGetAll.toArray.mockResolvedValue(fakeTheaters);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters?limit=2&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.data).toEqual(fakeTheaters);
  });

  it("return 200 with an empty array", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbGetAll.toArray.mockResolvedValue([]);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe('No theaters found');
    expect(json.data).toEqual([]);
  });

  it('return 200 with theaters when no query paramaters are provided', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);

    const fakeTheaters = [
      {
        _id: "59a47286cfa9a3a73e51e72d",
        theaterId: 2025,
        location: {
          address: {
            street1: "340 W Market",
            street2: "Ste backerstreet",
            city: "Bloomington",
            state: "MN",
            zipcode: "55425"
          },
          geo: {
            type: "Point",
            coordinates: [
              -93.24565,
              44.85466
            ]
          }
        }
      },
      {
        _id: "59a47286cfa9a3a73e51e72e",
        theaterId: 1789,
        location: {
          address: {
            street1: "1621 E Monte Vista Ave",
            city: "Vacaville",
            state: "CA",
            zipcode: "55425"
          },
          geo: {
            type: "Point",
            coordinates: [
              -121.96328,
              38.367649
            ]
          }
        }
      }
    ];

    mockDbGetAll.toArray.mockResolvedValue(fakeTheaters);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.data).toEqual(fakeTheaters);

    expect(mockDbGetAll.skip).toHaveBeenCalledWith(0);
    expect(mockDbGetAll.limit).toHaveBeenCalledWith(10);
  });

  it("return 400 if invalid query parameters", async () => {
    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters?limit=1000&page=-1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Invalid query parameters');
  });

  it("return 404 if collection 'theaters' doesn't exists", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'theaters' not found");
  });

  it("return 405 if method is not allowed", async () => {
    const req = {
      method: 'POST',
      url: 'http://localhost/api/theaters'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it("return 500 with Error instance", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Error instance');
  });

  it("return 500 in case of unknown error", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockImplementation(() => {
      throw "Error in string and not instance of Error";
    });

    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});

/*==========================================*/
/*============ CREATE A THEATER ============*/
/*==========================================*/
describe('POST /api/theaters', () => {
  const collectionMock = {
    findOne: jest.fn(),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn()
    }),
    insertOne: jest.fn()
  };

  const mockDbPost = {
    collection: jest.fn().mockReturnValue(collectionMock)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (body: object | null, method: string = 'POST') =>
    ({
      method,
      json: async () => body,
    }) as unknown as NextRequest;

  it("return 201 with the created theater", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbPost);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    collectionMock.findOne.mockResolvedValue(null);
    collectionMock.find().sort().limit().toArray.mockResolvedValue([{ theaterId: 3 }]);
    collectionMock.insertOne.mockResolvedValue({ insertedId: 'fakeObjectId123' });

    const req = buildRequest({ location: { address: '123, rue des champs', city: 'Cazaux', state: 'IDF' } });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.message).toBe('Theater created');
    expect(json.status).toBe(201);
    expect(json.data).toEqual({
      _id: 'fakeObjectId123',
      theaterId: 4,
      location: { address: '123, rue des champs', city: 'Cazaux', state: 'IDF' }
    });
    expect(collectionMock.insertOne).toHaveBeenCalledWith(expect.objectContaining({
      theaterId: 4,
      location: { address: '123, rue des champs', city: 'Cazaux', state: 'IDF' }
    }));
  });

  it('return 201 with theaterId = 1 if no theaters exist', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbPost);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);

    collectionMock.findOne.mockResolvedValue(null);
    collectionMock.find().sort().limit().toArray.mockResolvedValue([]);
    collectionMock.insertOne.mockResolvedValue({ insertedId: 'firstTheaterId' });

    const req = buildRequest({ location: { address: '1, rue de la paix', city: 'Paris', state: 'IDF' } });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.status).toBe(201);
    expect(json.message).toBe('Theater created');
    expect(json.data).toEqual({
      _id: 'firstTheaterId',
      theaterId: 1,
      location: { address: '1, rue de la paix', city: 'Paris', state: 'IDF' }
    });
  });

  describe('returns 400 if body is missing or not an object', () => {
    const invalidBodies = [
      { label: 'null', value: null },
      { label: 'a string', value: "not-an-object" },
      { label: 'an array', value: [] },
      { label: 'a number', value: 123 }
    ];

    it.each(invalidBodies)(
      'returns 400 if body is $label',
      async ({ value }) => {
        const req = buildRequest(value as unknown as object);

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.status).toBe(400);
        expect(json.error).toBe('Request body is required and must be an object');
      }
    );
  });

  describe('returns 400 if location is missing or not an object', () => {
    const invalidLocations = [
      { label: 'null', value: null },
      { label: 'a string', value: "not-an-object" },
      { label: 'an array', value: [] },
      { label: 'a number', value: 123 }
    ];

    it.each(invalidLocations)(
      'returns 400 if location is $label',
      async ({ value }) => {
        const req = buildRequest({ location: value });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.status).toBe(400);
        expect(json.error).toBe('Location is required and must be an object');
      }
    );
  });

  it("return 404 if collection 'theaters' doesn't exists", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbPost);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = buildRequest({ location: { address: 'X', city: 'Y', state: 'Z' } });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'theaters' not found");
  });

  it("return 405 if method is not allowed", async () => {
    const req = buildRequest({}, 'GET');

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it('return 409 if theater already exists', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbPost);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    collectionMock.findOne.mockResolvedValue({ theaterId: 99 });

    const req = buildRequest({ location: { address: '13, rue de la chance', city: 'Cavignac', state: 'Aquitaine' } });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.status).toBe(409);
    expect(json.error).toBe('Theater already exists');
  });

  it("return 500 with Error instance", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    const body = JSON.stringify({ location: { address: '13, rue de la chance', city: 'Cavignac', state: 'Aquitaine' } });

    const req = new Request('http://localhost/api/theaters', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    }) as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Error instance');
  });

  it("return 500 in case of unknown error", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockImplementation(() => {
      throw 'Error in string and not instance of Error';
    });

    const body = JSON.stringify({ location: { address: '13, rue de la chance', city: 'Cavignac', state: 'Aquitaine' } });

    const req = new Request('http://localhost/api/theaters', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    }) as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});

/*==============================================*/
/*============ GET A SINGLE THEATER ============*/
/*==============================================*/
describe('GET /api/theaters/[id]', () => {
  const mockDbFindOne = {
    collection: jest.fn().mockReturnThis(),
    findOne: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (idTheater: string, method: string = 'GET') => ({
    method
  }) as unknown as NextRequest;

  const buildContext = (idTheater: string) => ({
    params: Promise.resolve({ idTheater })
  });

  it('return 200 with theater', async () => {
    const theater = {
      _id: "59a47286cfa9a3a73e51e72d",
      theaterId: 2025,
      location: {
        address: {
          street1: "340 W Market",
          street2: "Ste backerstreet",
          city: "Bloomington",
          state: "MN",
          zipcode: "55425"
        },
        geo: {
          type: "Point",
          coordinates: [
            -93.24565,
            44.85466
          ]
        }
      }
    };
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbFindOne);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbFindOne.findOne.mockResolvedValue(theater);

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.data).toEqual(theater);
  });

  it('return 200 with empty array if theater not found', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbFindOne);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbFindOne.findOne.mockResolvedValue(null);

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe('Theater not found');
    expect(json.data).toEqual([]);
  });

  it("return 400 if theater ObjectId is invalid", async () => {
    const req = buildRequest('invalid-id');
    const context = buildContext('invalid-id');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Invalid theater ObjectId parameter format');
  });

  it("return 404 if collection 'theaters' doesn't exist", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbFindOne);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'theaters' not found");
  });

  it("return 405 if method is not allowed", async () => {
    const req = buildRequest('123', 'POST');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it("return 500 with Error instance", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Error instance');
  });

  it("return 500 in case of unknown error", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockImplementation(() => {
      throw "string error";
    });

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});

/*=================================================*/
/*============ MODIFY A SINGLE THEATER ============*/
/*=================================================*/
describe('PUT /api/theaters/[id]', () => {
  const mockDbUpdate = {
    collection: jest.fn().mockReturnThis(),
    updateOne: jest.fn(),
    findOne: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (idTheater: string, body: object | null, method = 'PUT') => ({
    method,
    json: jest.fn().mockResolvedValue(body)
  }) as unknown as NextRequest;

  const buildContext = (idTheater: string) => ({
    params: Promise.resolve({ idTheater })
  });

  it('returns 200 with updated theater', async () => {
    const updatedStreet = "123 New Street";

    const updatedTheater = {
      _id: "59a47286cfa9a3a73e51e72d",
      theaterId: 2025,
      location: {
        address: {
          street1: updatedStreet,
          street2: "Ste backerstreet",
          city: "Bloomington",
          state: "MN",
          zipcode: "55425"
        },
        geo: {
          type: "Point",
          coordinates: [
            -93.24565,
            44.85466
          ]
        }
      }
    };
    const updateResult = { matchedCount: 1 };

    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbUpdate);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbUpdate.updateOne.mockResolvedValue(updateResult);
    mockDbUpdate.findOne.mockResolvedValue(updatedTheater);

    const req = buildRequest(
      '507f191e810c19729de860ea',
      { location:
        {
          address: {
            street1: updatedStreet
          }
        }
      }
    );
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe('Theater updated');
    expect(json.data.updatedTheater).toEqual(updatedTheater);
  });

  it('returns 400 if theater ObjectId is invalid', async () => {
    const req = buildRequest('invalid-id', { title: 'Try update' });
    const context = buildContext('invalid-id');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Invalid theater ObjectID parameter format');
  });

  describe('returns 400 if body is missing or not an object', () => {
    const invalidBodies = [
      { label: 'null', value: null },
      { label: 'a string', value: "not-an-object" },
      { label: 'an array', value: [] },
      { label: 'a number', value: 123 }
    ];

    it.each(invalidBodies)(
      'returns 400 if body is $label',
      async ({ value }) => {
        const req = buildRequest('507f191e810c19729de860ea', value as unknown as object);
        const context = buildContext('507f191e810c19729de860ea');

        const res = await PUT_BY_ID(req, context);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.status).toBe(400);
        expect(json.error).toBe('Request body is required and must be an object');
      }
    );
  });

  it('returns 404 if theater not found', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbUpdate);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbUpdate.updateOne.mockResolvedValue({ matchedCount: 0 });

    const req = buildRequest('507f191e810c19729de860ea', { title: 'Try update' });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe('Theater not found');
  });

  it("returns 404 if collection 'theaters' doesn't exist", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbUpdate);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = buildRequest('507f191e810c19729de860ea', { title: 'Test' });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'theaters' not found");
  });

  it('returns 405 if method is not allowed', async () => {
    const req = buildRequest('507f191e810c19729de860ea', { title: 'x' }, 'POST');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it('returns 500 with Error instance', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    const req = buildRequest('507f191e810c19729de860ea', { title: 'x' });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Error instance');
  });

  it('returns 500 in case of unknown error', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockImplementation(() => {
      throw 'unexpected string error';
    });

    const req = buildRequest('507f191e810c19729de860ea', { title: 'x' });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});
