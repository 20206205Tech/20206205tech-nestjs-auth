import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { MfaGuard } from './mfa.guard';

describe('MfaGuard', () => {
  let guard: MfaGuard;

  beforeEach(() => {
    guard = new MfaGuard();
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

    it('should return false if there is no user', () => {
      const getRequestSpy = jest.fn().mockReturnValue({});
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should throw ForbiddenException if user has aal1', () => {
      const getRequestSpy = jest
        .fn()
        .mockReturnValue({ user: { aal: 'aal1' } });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should return true if user has aal2', () => {
      const getRequestSpy = jest
        .fn()
        .mockReturnValue({ user: { aal: 'aal2' } });
      (context.switchToHttp().getRequest as jest.Mock) = getRequestSpy;

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
