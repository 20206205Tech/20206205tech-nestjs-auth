import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser, CurrentUserId } from './current-user.decorator';

type DecoratorFactory = (data: unknown, context: ExecutionContext) => any;

function getParamDecoratorFactory(
  decorator: (...args: any[]) => any,
): DecoratorFactory {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(@decorator() _: unknown) {}
  }

  const args = (Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test') ||
    {}) as Record<string, any>;
  const metadata = args[Object.keys(args)[0]] as { factory: DecoratorFactory };
  return metadata.factory;
}

describe('CurrentUserDecorators', () => {
  let mockContext: ExecutionContext;
  let mockRequest: { user?: { userId: string; email: string } };

  beforeEach(() => {
    mockRequest = {
      user: {
        userId: 'user-id',
        email: 'test@example.com',
      },
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;
  });

  describe('CurrentUserId', () => {
    it('should return the user id from request', () => {
      const factory = getParamDecoratorFactory(CurrentUserId);
      const result = factory(null, mockContext) as string;
      expect(result).toBe('user-id');
    });

    it('should return undefined if no user in request', () => {
      mockRequest.user = undefined;
      const factory = getParamDecoratorFactory(CurrentUserId);
      const result = factory(null, mockContext) as string | undefined;
      expect(result).toBeUndefined();
    });
  });

  describe('CurrentUser', () => {
    it('should return the full user object from request', () => {
      const factory = getParamDecoratorFactory(CurrentUser);
      const result = factory(null, mockContext) as object;
      expect(result).toEqual(mockRequest.user);
    });

    it('should return undefined if no user in request', () => {
      mockRequest.user = undefined;
      const factory = getParamDecoratorFactory(CurrentUser);
      const result = factory(null, mockContext) as object | undefined;
      expect(result).toBeUndefined();
    });
  });
});
