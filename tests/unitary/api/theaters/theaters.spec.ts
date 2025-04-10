import { NextRequest } from 'next/server';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from '@/lib/check-collection-exists';

import { GET } from '@/app/api/theaters/route';

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
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe(200);
    expect(body.data).toEqual(fakeTheaters);
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
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.message).toBe('No theaters found');
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
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe(200);
    expect(body.data).toEqual(fakeTheaters);

    expect(mockDbGetAll.skip).toHaveBeenCalledWith(0);
    expect(mockDbGetAll.limit).toHaveBeenCalledWith(10);
  });

  it("return 400 if invalid query parameters", async () => {
    const req = {
      method: 'GET',
      url: 'http://localhost/api/theaters?limit=1000&page=-1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Invalid query parameters');
  });
});