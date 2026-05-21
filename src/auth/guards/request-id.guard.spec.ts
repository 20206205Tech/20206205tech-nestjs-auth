import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { RequestIdGuard } from './request-id.guard';

describe('RequestIdGuard', () => {
  let guard: RequestIdGuard;

  beforeEach(() => {
    guard = new RequestIdGuard();
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

    it('should throw BadRequestException if Request-Id header is missing', () => {
      const getRequestSpy = jest.fn().mockReturnValue({ headers: {} });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(() => guard.canActivate(context)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if headers are undefined', () => {
      const getRequestSpy = jest.fn().mockReturnValue({});
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(() => guard.canActivate(context)).toThrow(BadRequestException);
    });

    it('should return true if Request-Id header is present', () => {
      const getRequestSpy = jest
        .fn()
        .mockReturnValue({ headers: { 'request-id': 'abc-123' } });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
