import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from '@/lib/check-collection-exists';

import { POST } from '@/app/api/auth/logout/route';


jest.mock('@/lib/mongodb');
jest.mock('@/lib/check-collection-exists');


/*=============================================*/
/*============ LOGOUT CURRENT USER ============*/
/*=============================================*/
describe('POST /api/users/logout', () => {
  const userId = '661a1fae2c10e1e9e0fa0f84';

  const userCollectionMock = {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  const sessionCollectionMock = {
    deleteOne: jest.fn(),
  };

  const mockDb = {
    collection: jest.fn((name: string) => {
      if (name === 'users') return userCollectionMock;
      if (name === 'sessions') return sessionCollectionMock;
      return null;
    }),
    listCollections: jest.fn(),
  };

  const buildRequest = (token?: string, refreshToken?: string, method = 'POST') =>
    ({
      method,
      cookies: {
        get: (key: string) => {
          if (key === 'token') return { value: token };
          if (key === 'refreshToken') return { value: refreshToken };
          return undefined;
        },
      },
    } as unknown as NextRequest);

  beforeEach(() => {
    jest.clearAllMocks();

    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);

    userCollectionMock.findOne.mockResolvedValue({ _id: userId });
    userCollectionMock.deleteOne.mockResolvedValue({ deletedCount: 1 });
    sessionCollectionMock.deleteOne.mockResolvedValue({ deletedCount: 1 });
  });

  it("return 200 if user is successfully logged out and also delete session", async () => {
    const username = 'Neo';

    const req = buildRequest('validToken', 'validRefreshToken');

    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
      user_id: userId,
      name: username
    }));

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.message).toBe(`See you later ${username} 👋`);

    expect(userCollectionMock.deleteOne).toHaveBeenCalledWith({ _id: userId });
    expect(sessionCollectionMock.deleteOne).toHaveBeenCalledWith({ userId: userId });
  });

  it("return 400 if tokens are missing", async () => {
    const req = buildRequest(undefined, undefined);

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json.error).toBe('No tokens found in cookies');
  });

  it("return 401 if invalid token", async () => {
    const invalidToken = 'invalidToken';

    const req = buildRequest(invalidToken, 'validRefreshToken');

    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new jwt.JsonWebTokenError('Invalid token');
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.status).toBe(401);
    expect(json.error).toBe('Invalid token');
  });

  it("return 401 if invalid refreshToken", async () => {
    const invalidRefreshToken = 'invalidRefreshToken';

    const req = buildRequest('validToken', invalidRefreshToken);

    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => true);
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new jwt.JsonWebTokenError('Invalid refreshToken');
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.status).toBe(401);
    expect(json.error).toBe('Invalid refreshToken');
  });

  it("return 404 if user not found", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      user_id: userId,
      name: "Neo"
    }));

    userCollectionMock.findOne.mockResolvedValue(null);

    const req = buildRequest("validToken", "validRefreshToken");

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("User not found");
  });

  it("return 404 if collection 'sessions' doesn't exists", async () => {
    mockDb.listCollections.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { name: "users" }
      ])
    });

    mockDb.collection.mockImplementation((name: string) => {
      if (name === "users") return userCollectionMock;
      if (name === "sessions") return null;
      return null;
    });

    const req = buildRequest("validToken", "validRefreshToken");

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'sessions' not found");
  });

  it("return 404 if collection 'users' doesn't exists", async () => {
    userCollectionMock.findOne.mockResolvedValue(null);

    const req = buildRequest('validToken', 'validRefreshToken');

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.status).toBe(404);
    expect(json.error).toBe("Collection 'users' not found");
  });

  it("return 405 if method is not allowed", async () => {
    const req = buildRequest("fakeToken", "fakeRefreshToken", 'GET');

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it("return 500 with Error instance", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    const req = buildRequest('validToken', 'validRefreshToken');

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

    const req = buildRequest('validToken', 'validRefreshToken');

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});
