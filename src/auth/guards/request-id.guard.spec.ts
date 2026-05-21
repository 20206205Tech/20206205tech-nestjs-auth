import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { RequestIdGuard } from './request-id.guard';

describe('RequestIdGuard', () => {
  let guard: RequestIdGuard;
  let originalEnv: string | undefined;

  beforeEach(() => {
    guard = new RequestIdGuard();
    originalEnv = process.env.ENVIRONMENT;
  });

  afterEach(() => {
    process.env.ENVIRONMENT = originalEnv;
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

    it('should throw BadRequestException if Request-Id header is missing', () => {
      process.env.ENVIRONMENT = 'production';
      const getRequestSpy = jest.fn().mockReturnValue({ headers: {} });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(() => guard.canActivate(context)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if headers are undefined', () => {
      process.env.ENVIRONMENT = 'production';
      const getRequestSpy = jest.fn().mockReturnValue({});
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(() => guard.canActivate(context)).toThrow(BadRequestException);
    });

    it('should return true if Request-Id header is present', () => {
      process.env.ENVIRONMENT = 'production';
      const getRequestSpy = jest
        .fn()
        .mockReturnValue({ headers: { 'request-id': 'abc-123' } });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
