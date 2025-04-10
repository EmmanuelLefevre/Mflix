import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

import MongoDBSingleton from '@/lib/mongodb';
import { checkCollectionExists } from '@/lib/check-collection-exists';

import { DELETE as DELETE_BY_ID} from '@/app/api/users/[idUser]/route';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/check-collection-exists');
jest.mock('jsonwebtoken');


/*==============================================*/
/*============ DELETE A SINGLE USER ============*/
/*==============================================*/
describe('DELETE /api/users/:id', () => {
  const mockDb = {
    collection: jest.fn().mockReturnThis(),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    deleteMany: jest.fn()
  };

  const buildRequest = (
    idUser: string,
    cookies: Record<string, string | undefined> = {},
    method = 'DELETE'
  ) =>
    ({
      method,
      cookies: {
        get: (name: string) =>
          cookies[name] ? { value: cookies[name] } : undefined
      }
    } as unknown as NextRequest);

  const buildContext = (idUser: string) => ({
    params: Promise.resolve({ idUser })
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 200 and clears cookies if user is deleted', async () => {
    const token = 'valid-token';
    const refreshToken = 'valid-refresh-token';
    const idUser = '507f191e810c19729de860ea';

    (jwt.verify as jest.Mock).mockImplementation((tokenValue: string) => {
      if (tokenValue === token) return { user_id: idUser, name: 'John' };
      if (tokenValue === refreshToken) return { user_id: idUser };
    });

    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDb.deleteOne.mockResolvedValue({ deletedCount: 1 });
    mockDb.deleteMany.mockResolvedValue({});

    const req = buildRequest(idUser, { token, refreshToken });
    const context = buildContext(idUser);

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe('User and session data deleted');
    expect(json.farewell).toContain('John');
  });

  it('returns 400 if user ObjectId is invalid', async () => {
    const req = buildRequest('invalid-id', {
      token: 'token',
      refreshToken: 'refreshToken'
    });

    const context = buildContext('invalid-id');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid user ObjectId parameter format');
  });

  it('returns 400 if tokens are missing', async () => {
    const req = buildRequest('507f191e810c19729de860ea', {});
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('No tokens found in cookies');
  });

  it('returns 400 if token is missing', async () => {
    const req = buildRequest('507f191e810c19729de860ea', {
      refreshToken: 'validRefreshToken'
    });

    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('No token provided');
  });

  it('returns 400 if refreshToken is missing', async () => {
    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'validToken'
    });

    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('No refreshToken provided');
  });

  it('returns 400 if unable to extract user information from token', async () => {
    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'validTokenWithoutName',
      refreshToken: 'validRefreshToken'
    });

    const context = buildContext('507f191e810c19729de860ea');

    const mockVerify = jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      return { user_id: '507f191e810c19729de860ea' };
    });

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Unable to extract user information from token');

    mockVerify.mockRestore();
  });

  it('returns 401 if token is invalid', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'invalid-token',
      refreshToken: 'refresh-token'
    });

    const context = buildContext('507f191e810c19729de860ea');

    const mockVerify = jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Invalid token');

    mockVerify.mockRestore();
  });

  it('returns 401 if refreshToken is invalid', async () => {
    const mockVerifyToken = jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      return { user_id: '507f191e810c19729de860ea' };
    });

    const mockVerifyRefreshToken = jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('Invalid refreshToken');
    });

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'validToken',
      refreshToken: 'invalid-refreshToken'
    });

    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Invalid refreshToken');

    mockVerifyToken.mockRestore();
    mockVerifyRefreshToken.mockRestore();
  });

  it('returns 403 if user tries to delete another user', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => ({
      user_id: 'different-id',
      name: 'John'
    }));

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'token',
      refreshToken: 'refreshToken'
    });

    const context = buildContext('507f191e810c19729de860ea');
    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe('You can only delete your own account');
  });


  it('returns 404 if user not found', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);
    (checkCollectionExists as jest.Mock).mockResolvedValue(true);
    mockDb.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'token',
      refreshToken: 'refreshToken'
    });

    (jwt.verify as jest.Mock).mockImplementation(() => ({
      user_id: '507f191e810c19729de860ea',
      name: 'John'
    }));

    const context = buildContext('507f191e810c19729de860ea');
    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('User not found');
  });

  it("returns 404 if a collection doesn't exist", async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);
    (checkCollectionExists as jest.Mock).mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    (jwt.verify as jest.Mock).mockImplementation(() => ({
      user_id: '507f191e810c19729de860ea',
      name: 'John'
    }));

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'token',
      refreshToken: 'refreshToken'
    });

    const context = buildContext('507f191e810c19729de860ea');
    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toMatch(/Collection/);
  });

  it('returns 500 if an error occurs while deleting session', async () => {
    const mockDeleteMany = jest.fn().mockRejectedValue(new Error("Can't delete session because it's not found or already deleted"));

    const mockDb = {
      collection: jest.fn().mockReturnValue({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        deleteMany: mockDeleteMany
      })
    };

    (MongoDBSingleton.getDbInstance as jest.Mock).mockResolvedValue(mockDb);

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'validToken',
      refreshToken: 'validRefreshToken'
    });
    const context = buildContext('507f191e810c19729de860ea');

    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Can't delete session because it's not found or already deleted");

    expect(mockDeleteMany).toHaveBeenCalledWith({ jwt: 'validToken', refreshToken: 'validRefreshToken' });
  });

  it('returns 405 if method is not allowed', async () => {
    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'token',
      refreshToken: 'refreshToken'
    }, 'POST');

    const context = buildContext('507f191e810c19729de860ea');
    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(405);
    expect(json.error).toBe('Method Not Allowed');
  });

  it('returns 500 with Error instance', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockRejectedValue(new Error('Error instance'));

    (jwt.verify as jest.Mock).mockImplementation(() => ({
      user_id: '507f191e810c19729de860ea',
      name: 'John'
    }));

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'token',
      refreshToken: 'refreshToken'
    });

    const context = buildContext('507f191e810c19729de860ea');
    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Error instance');
  });

  it('returns 500 in case of unknown error', async () => {
    (MongoDBSingleton.getDbInstance as jest.Mock).mockImplementation(() => {
      throw 'Some string error';
    });

    (jwt.verify as jest.Mock).mockImplementation(() => ({
      user_id: '507f191e810c19729de860ea',
      name: 'John'
    }));

    const req = buildRequest('507f191e810c19729de860ea', {
      token: 'token',
      refreshToken: 'refreshToken'
    });

    const context = buildContext('507f191e810c19729de860ea');
    const res = await DELETE_BY_ID(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Unknown error occurred');
  });
});
