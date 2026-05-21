import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RequestKongSecretGuard } from './request-kong-secret.guard';

describe('RequestKongSecretGuard', () => {
  let guard: RequestKongSecretGuard;
  let originalEnv: string | undefined;
  let originalSecret: string | undefined;

  beforeEach(() => {
    guard = new RequestKongSecretGuard();
    originalEnv = process.env.ENVIRONMENT;
    originalSecret = process.env.REQUEST_KONG_SECRET;
  });

  afterEach(() => {
    process.env.ENVIRONMENT = originalEnv;
    process.env.REQUEST_KONG_SECRET = originalSecret;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;

    beforeEach(() => {
      context = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should return true if ENVIRONMENT is development', () => {
      process.env.ENVIRONMENT = 'development';
      const getRequestSpy = jest.fn().mockReturnValue({ headers: {} });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should return true if ENVIRONMENT is test', () => {
      process.env.ENVIRONMENT = 'test';
      const getRequestSpy = jest.fn().mockReturnValue({ headers: {} });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw UnauthorizedException if Request-Kong-Secret header is missing', () => {
      process.env.ENVIRONMENT = 'production';
      process.env.REQUEST_KONG_SECRET = 'my-secret';
      const getRequestSpy = jest.fn().mockReturnValue({ headers: {} });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if Request-Kong-Secret does not match', () => {
      process.env.ENVIRONMENT = 'production';
      process.env.REQUEST_KONG_SECRET = 'my-secret';
      const getRequestSpy = jest.fn().mockReturnValue({
        headers: { 'request-kong-secret': 'wrong-secret' },
      });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should return true if Request-Kong-Secret matches', () => {
      process.env.ENVIRONMENT = 'production';
      process.env.REQUEST_KONG_SECRET = 'my-secret';
      const getRequestSpy = jest.fn().mockReturnValue({
        headers: { 'request-kong-secret': 'my-secret' },
      });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
