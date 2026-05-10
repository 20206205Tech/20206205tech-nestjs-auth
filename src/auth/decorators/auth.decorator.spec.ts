import { Auth } from './auth.decorator';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../constants/auth.constant';
import { UserRole } from '../enums/user-role.enum';

jest.mock(
  '@nestjs/swagger',
  () => ({
    ApiBearerAuth: () => jest.fn(),
    ApiForbiddenResponse: () => jest.fn(),
    ApiUnauthorizedResponse: () => jest.fn(),
  }),
  { virtual: true },
);

describe('AuthDecorator', () => {
  describe('Public', () => {
    it('should set IS_PUBLIC_KEY metadata to true', () => {
      class TestClass {
        @Auth.Public()
        testMethod() {}
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metadata = Reflect.getMetadata(
        IS_PUBLIC_KEY,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        TestClass.prototype.testMethod,
      );
      expect(metadata).toBe(true);
    });
  });

  describe('Admin', () => {
    it('should set ROLES_KEY metadata to [ADMIN]', () => {
      class TestClass {
        @Auth.Admin()
        testMethod() {}
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metadata = Reflect.getMetadata(
        ROLES_KEY,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        TestClass.prototype.testMethod,
      );
      expect(metadata).toEqual([UserRole.ADMIN]);
    });
  });
});
