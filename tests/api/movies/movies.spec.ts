import { NextRequest } from 'next/server';

import { GET } from '@/app/api/movies/route';
import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from '@/lib/check-collection-exists';


jest.mock('@/lib/mongodb');
jest.mock('@/lib/check-collection-exists');

describe('GET /api/movies', () => {
  const mockDb = {
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
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);
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

    mockDb.toArray.mockResolvedValue(fakeMovies);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=2&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe(200);
    expect(body.data).toEqual(fakeMovies);
  });

  it("return 200 with an empty array", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDb.toArray.mockResolvedValue([]);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.message).toBe('No movies found');
  });

  it('return 400 if invalid query parameters', async () => {
    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=1000&page=-1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Invalid query parameters');
  });

  it("return 404 if collection 'movies' doesn't exists", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);
    (checkCollectionExists as jest.Mock).mockResolvedValue(false);

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Collection 'movies' not found");
  });

  it('return 405 if method is not allowed', async () => {
    const req = {
      method: 'POST',
      url: 'http://localhost/api/movies'
    } as unknown as NextRequest;

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(405);
    expect(body.error).toBe('Method Not Allowed');
  });

  it('return 500 in case of unexpected errror', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('DB down'));

    const req = {
      method: 'GET',
      url: 'http://localhost/api/movies?limit=10&page=1'
    } as unknown as NextRequest;

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('DB down');
  });
});
