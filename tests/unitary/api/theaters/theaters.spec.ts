import { NextRequest } from 'next/server';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from '@/lib/check-collection-exists';

import { GET, POST } from '@/app/api/theaters/route';

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

  it('return 400 if body is missing', async () => {
    const req = buildRequest(null);

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Request body is required and must be an object');
  });

  it('return 400 if location is missing', async () => {
    const req = buildRequest({});

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Location is required and must be an object');
  });

  it('return 400 if body is not an object', async () => {
    const req = buildRequest("fake string" as unknown as object);

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Request body is required and must be an object');
  });

  it('return 400 if location is not an object', async () => {
    const req = buildRequest({ location: 'string au lieu d\'objet' });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Location is required and must be an object');
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

    const req = new Request('http://localhost/api/movies', {
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

    const req = new Request('http://localhost/api/movies', {
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
