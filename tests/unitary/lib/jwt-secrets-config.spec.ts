import { JWT_SECRET, REFRESH_SECRET } from '@/lib/jwt-secrets-config';


describe('EnvConfig', () => {
  beforeEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.REFRESH_SECRET;
    jest.resetModules();
  });

  it('should load environment variables', () => {
    process.env.JWT_SECRET = 'test_jwt_secret';
    process.env.REFRESH_SECRET = 'test_refresh_secret';

    expect(JWT_SECRET).toBe('test_jwt_secret');
    expect(REFRESH_SECRET).toBe('test_refresh_secret');
  });

  it('should throw an error if JWT_SECRET is missing', () => {
    process.env.REFRESH_SECRET = 'test_refresh_secret';

    expect(() => {
      require('@/lib/jwt-secrets-config');
    }).toThrow('⚠️ JWT_SECRET or/and REFRESH_SECRET are missing from environment variables !');
  });

  it('should throw an error if REFRESH_SECRET is missing', () => {
    process.env.JWT_SECRET = 'test_jwt_secret';

    expect(() => {
      require('@/lib/jwt-secrets-config');
    }).toThrow('⚠️ JWT_SECRET or/and REFRESH_SECRET are missing from environment variables !');
  });

  it('should throw an error if both JWT_SECRET and REFRESH_SECRET are missing', () => {
    expect(() => {
      require('@/lib/jwt-secrets-config');
    }).toThrow('⚠️ JWT_SECRET or/and REFRESH_SECRET are missing from environment variables !');
  });
});
