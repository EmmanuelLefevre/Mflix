import { NextRequest } from 'next/server';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from '@/lib/check-collection-exists';

import { GET, POST } from '@/app/api/movies/route';
import {
  DELETE as DELETE_BY_ID,
  GET as GET_BY_ID,
  PUT as PUT_BY_ID
} from '@/app/api/movies/[idMovie]/route';


jest.mock('@/lib/mongodb');
jest.mock('@/lib/check-collection-exists');


/*========================================*/
/*============ GET ALL MOVIES ============*/
/*========================================*/
describe('GET /api/movies', () => {
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

  it('return 200 with movies', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);

    const fakeMovies = [
      {
        _id: "573a1390f29313caabcd446f",
        title: "The Great Train Robbery",
        plot: "A group of bandits stage a brazen train hold-up...",
        genres: ["Short", "Western"],
        runtime: 11,
        cast: [
          "A.C. Abadie",
          "Gilbert M. 'Broncho Billy' Anderson"
        ],
        num_mflix_comments: 0,
        fullplot: "Among the earliest existing films in American cinema...",
        languages: ["English"],
        released: "1903-12-01T00:00:00.000+00:00",
        directors: ["Edwin S. Porter"],
        rated: "TV-G",
        awards: {
          wins: 1,
          nominations: 0,
          text: "1 win."
        },
        lastupdated: "2015-08-13 00:27:59.177000000",
        year: 1903,
        imdb: {
          rating: 7.4,
          votes: 9847,
          id: 439
        },
        countries: ["USA"],
        type: "movie",
        tomatoes: {},
        viewer: {
          rating: 3.7,
          numReviews: 2559,
          meter: 75,
          fresh: 6
        },
        critic: {
          rating: 7.6,
          numReviews: 6,
          meter: 100,
          rotten: 0
        },
        poster: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYt..."
      },
      {
        _id: "573a1392f29313caabcda70a",
        title: "Black Fury",
        plot: "An immigrant coal miner finds himself in the middle of a bitter labor …",
        genres: ["Crime", "Drama", "Romance"],
        runtime: 94,
        rated: "APPROVED",
        cast: [
          "Paul Muni",
          "Karen Morley",
          "William Gargan",
          "Barton MacLane"
        ],
        poster: "https://m.media-amazon.com/images/M/MV5BMTQwMzU0NDY0NV5BMl5BanBnXkFtZT…",
        fullplot: "An immigrant coal miner finds himself in the middle of a bitter labor …",
        languages: ["English"],
        released: "1935-05-18T00:00:00.000+00:00",
        directors: ["Michael Curtiz"],
        writers: [
          "Abem Finkel (screen play)",
          "Carl Erickson (screen play)",
          "Michael A. Musmanno (original story 'Jan Volkanik')",
          "Harry R. Irving (play)"
        ],
        awards: {
          wins: 0,
          nominations: 2,
          text: "Nominated for 1 Oscar. Another 1 nomination."
        },
        lastupdated: "2015-09-17 04:41:44.297000000",
        year: 1935,
        imdb: {
          rating: 6.7,
          votes: 511,
          id: 26121
        },
        countries: ["USA"],
        type: "movie",
        tomatoes: {},
        viewer: {
          rating: 1,
          numReviews: 40
        },
        dvd: "2008-01-15T00:00:00.000+00:00",
        lastUpdated: "2015-08-22T19:10:15.000+00:00",
        num_mflix_comments: 0
      }
    ];

    mockDbGetAll.toArray.mockResolvedValue(fakeMovies);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=2&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.data).toEqual(fakeMovies);
  });

  it("return 200 with an empty array", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbGetAll.toArray.mockResolvedValue([]);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe('No movies found');
    expect(json.data).toEqual([]);
  });

  it('return 200 with movies when no query paramaters are provided', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);

    const fakeMovies = [
      {
        _id: "573a1390f29313caabcd446f",
        title: "The Great Train Robbery",
        plot: "A group of bandits stage a brazen train hold-up...",
        genres: ["Short", "Western"],
        runtime: 11,
        cast: [
          "A.C. Abadie",
          "Gilbert M. 'Broncho Billy' Anderson"
        ],
        num_mflix_comments: 0,
        fullplot: "Among the earliest existing films in American cinema...",
        languages: ["English"],
        released: "1903-12-01T00:00:00.000+00:00",
        directors: ["Edwin S. Porter"],
        rated: "TV-G",
        awards: {
          wins: 1,
          nominations: 0,
          text: "1 win."
        },
        lastupdated: "2015-08-13 00:27:59.177000000",
        year: 1903,
        imdb: {
          rating: 7.4,
          votes: 9847,
          id: 439
        },
        countries: ["USA"],
        type: "movie",
        tomatoes: {},
        viewer: {
          rating: 3.7,
          numReviews: 2559,
          meter: 75,
          fresh: 6
        },
        critic: {
          rating: 7.6,
          numReviews: 6,
          meter: 100,
          rotten: 0
        },
        poster: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYt..."
      },
      {
        _id: "573a1392f29313caabcda70a",
        title: "Black Fury",
        plot: "An immigrant coal miner finds himself in the middle of a bitter labor …",
        genres: ["Crime", "Drama", "Romance"],
        runtime: 94,
        rated: "APPROVED",
        cast: [
          "Paul Muni",
          "Karen Morley",
          "William Gargan",
          "Barton MacLane"
        ],
        poster: "https://m.media-amazon.com/images/M/MV5BMTQwMzU0NDY0NV5BMl5BanBnXkFtZT…",
        fullplot: "An immigrant coal miner finds himself in the middle of a bitter labor …",
        languages: ["English"],
        released: "1935-05-18T00:00:00.000+00:00",
        directors: ["Michael Curtiz"],
        writers: [
          "Abem Finkel (screen play)",
          "Carl Erickson (screen play)",
          "Michael A. Musmanno (original story 'Jan Volkanik')",
          "Harry R. Irving (play)"
        ],
        awards: {
          wins: 0,
          nominations: 2,
          text: "Nominated for 1 Oscar. Another 1 nomination."
        },
        lastupdated: "2015-09-17 04:41:44.297000000",
        year: 1935,
        imdb: {
          rating: 6.7,
          votes: 511,
          id: 26121
        },
        countries: ["USA"],
        type: "movie",
        tomatoes: {},
        viewer: {
          rating: 1,
          numReviews: 40
        },
        dvd: "2008-01-15T00:00:00.000+00:00",
        lastUpdated: "2015-08-22T19:10:15.000+00:00",
        num_mflix_comments: 0
      }
    ];

    mockDbGetAll.toArray.mockResolvedValue(fakeMovies);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.data).toEqual(fakeMovies);

    expect(mockDbGetAll.skip).toHaveBeenCalledWith(0);
    expect(mockDbGetAll.limit).toHaveBeenCalledWith(10);
  });

  it("return 400 if invalid query parameters", async () => {
    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=1000&page=-1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Invalid query parameters');
  });

  it("return 404 if collection 'movies' doesn't exists", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbGetAll);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'movies' not found");
  });

  it("return 405 if method is not allowed", async () => {
    const req = {
      method: 'POST',
      url: 'http://localhost/api/movies'
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
      url: 'http://localhost/api/movies?limit=10&page=1'
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
      url: 'http://localhost/api/movies?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});

/*========================================*/
/*============ CREATE A MOVIE ============*/
/*========================================*/
describe('POST /api/movies', () => {
  const collectionMock = {
    findOne: jest.fn(),
    insertOne: jest.fn()
  };

  const mockDbPost = {
    collection: jest.fn().mockReturnValue(collectionMock)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (body: object, method: string = 'POST') =>
    ({
      method,
      json: async () => body,
    }) as unknown as NextRequest;

  it("return 201 the created movie", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbPost);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    collectionMock.findOne.mockResolvedValue(null);
    collectionMock.insertOne.mockResolvedValue({ insertedId: 'fakeObjectId123' });

    const body = { title: 'Inception', year: 2010, director: 'Christopher Nolan' };
    const req = buildRequest(body);

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.status).toBe(201);
    expect(json.message).toBe('Movie created');
    expect(json.data).toEqual(expect.objectContaining({
      _id: 'fakeObjectId123',
      title: 'Inception',
      year: 2010,
      director: 'Christopher Nolan',
    }));
  });

  it("return 400 if title is required", async () => {
    const req = buildRequest({ year: 2010 });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.errors).toContain("Title is required and must be a string");
  });

  it("return 400 if title is invalid", async () => {
    const req = buildRequest({ title: 123, year: 2010 });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.errors).toContain("Title is required and must be a string");
  });

  it("return 400 if year is required", async () => {
    const req = buildRequest({ title: "Inception" });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.errors).toContain("Year is required and must be a number");
  });

  it("return 400 if year is invalid", async () => {
    const req = buildRequest({ title: "Inception", year: "2010" });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.errors).toContain("Year is required and must be a number");
  });

  it("return 404 if collection 'movies' doesn't exists", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbPost);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = buildRequest({ title: 'Inception', year: 2010 });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'movies' not found");
  });

  it("return 405 if method is not allowed", async () => {
    const req = buildRequest({ title: 'Inception', year: 2010 }, 'GET');

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it("return 409 if movie already exists", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbPost);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    collectionMock.findOne.mockResolvedValue({ title: 'Inception', year: 2010 });

    const req = buildRequest({ title: 'Inception', year: 2010 });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.status).toBe(409);
    expect(json.error).toBe('Movie already exists');
  });

  it("return 500 with Error instance", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    const body = JSON.stringify({ title: 'Matrix', year: 1999 });

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

    const body = JSON.stringify({ title: 'Inception', year: 2010 });

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

/*============================================*/
/*============ GET A SINGLE MOVIE ============*/
/*============================================*/
describe('GET /api/movies/[id]', () => {
  const mockDbFindOne = {
    collection: jest.fn().mockReturnThis(),
    findOne: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (idMovie: string, method: string = 'GET') => ({
    method
  }) as unknown as NextRequest;

  const buildContext = (idMovie: string) => ({
    params: Promise.resolve({ idMovie })
  });

  it('return 200 with movie', async () => {
    const movie = { _id: '123', title: 'Inception' };
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbFindOne);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbFindOne.findOne.mockResolvedValue(movie);

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.data).toEqual(movie);
  });

  it('return 200 with empty array if movie not found', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbFindOne);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbFindOne.findOne.mockResolvedValue(null);

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe('Movie not found');
    expect(json.data).toEqual([]);
  });

  it("return 400 if movie ObjectId is invalid", async () => {
    const req = buildRequest('invalid-id');
    const context = buildContext('invalid-id');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Invalid movie ObjectId parameter format');
  });

  it("return 404 if collection 'movies' doesn't exist", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbFindOne);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = buildRequest('123');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await GET_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'movies' not found");
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

/*===============================================*/
/*============ MODIFY A SINGLE MOVIE ============*/
/*===============================================*/
describe('PUT /api/movies/[id]', () => {
  const mockDbUpdate = {
    collection: jest.fn().mockReturnThis(),
    updateOne: jest.fn(),
    findOne: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (idMovie: string, body: object | null, method = 'PUT') => ({
    method,
    json: jest.fn().mockResolvedValue(body)
  }) as unknown as NextRequest;

  const buildContext = (idMovie: string) => ({
    params: Promise.resolve({ idMovie })
  });

  it('returns 200 with updated movie', async () => {
    const movie = { _id: '507f191e810c19729de860ea', title: 'Updated Title' };
    const updateResult = { matchedCount: 1 };

    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbUpdate);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbUpdate.updateOne.mockResolvedValue(updateResult);
    mockDbUpdate.findOne.mockResolvedValue(movie);

    const req = buildRequest('507f191e810c19729de860ea', { title: 'Updated Title' });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe('Movie updated');
    expect(json.data.updatedMovie).toEqual(movie);
  });

  it('returns 400 if movie ObjectId is invalid', async () => {
    const req = buildRequest('invalid-id', { title: 'Try update' });
    const context = buildContext('invalid-id');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Invalid movie ObjectID parameter format');
  });

  it('returns 400 if body is missing or not an object', async () => {
    const req = buildRequest('507f191e810c19729de860ea', null);
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Request body is required and must be an object');
  });

  it('returns 404 if movie not found', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbUpdate);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbUpdate.updateOne.mockResolvedValue({ matchedCount: 0 });

    const req = buildRequest('507f191e810c19729de860ea', { title: 'Try update' });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe('Movie not found');
  });

  it("returns 404 if collection 'movies' doesn't exist", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbUpdate);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = buildRequest('507f191e810c19729de860ea', { title: 'Test' });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await PUT_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'movies' not found");
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

/*===============================================*/
/*============ DELETE A SINGLE MOVIE ============*/
/*===============================================*/
describe('DELETE /api/movies/:id', () => {
  const mockDbDelete = {
    collection: jest.fn().mockReturnThis(),
    deleteOne: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (idMovie: string, method = 'DELETE') => ({
    method
  }) as unknown as NextRequest;

  const buildContext = (idMovie: string) => ({
    params: Promise.resolve({ idMovie })
  });

  it('returns 200 if movie is successfully deleted', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbDelete);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbDelete.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const req = buildRequest('507f191e810c19729de860ea');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe('Movie deleted');
  });

  it('returns 400 if movie ObjectId is invalid', async () => {
    const req = buildRequest('invalid-objectid');
    const context = buildContext('invalid-objectid');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('Invalid movie ObjectId parameter format');
  });

  it('returns 404 if movie not found', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbDelete);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDbDelete.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const req = buildRequest('507f191e810c19729de860ea');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe('Movie not found');
  });

  it("returns 404 if collection 'movies' doesn't exist", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDbDelete);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = buildRequest('507f191e810c19729de860ea');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'movies' not found");
  });

  it('returns 405 if method is not allowed', async () => {
    const req = buildRequest('507f191e810c19729de860ea', 'POST');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it('returns 500 with Error instance', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    const req = buildRequest('507f191e810c19729de860ea');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Error instance');
  });

  it('returns 500 in case of unknown error', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockImplementation(() => {
      throw 'Some string error';
    });

    const req = buildRequest('507f191e810c19729de860ea');
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});
