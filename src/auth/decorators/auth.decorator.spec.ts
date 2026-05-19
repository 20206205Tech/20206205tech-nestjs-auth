import { Auth } from './auth.decorator';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../constants/auth.constant';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MfaGuard } from '../guards/mfa.guard';
import { RolesGuard } from '../guards/roles.guard';

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

  describe('User', () => {
    it('should apply JwtAuthGuard and MfaGuard', () => {
      class TestClass {
        @Auth.User()
        testMethod() {}
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const guards = Reflect.getMetadata(
        '__guards__',
        // eslint-disable-next-line @typescript-eslint/unbound-method
        TestClass.prototype.testMethod,
      );
      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(MfaGuard);
    });
  });

  describe('Admin', () => {
    it('should set ROLES_KEY metadata to [ADMIN] and apply JwtAuthGuard, MfaGuard, and RolesGuard', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const guards = Reflect.getMetadata(
        '__guards__',
        // eslint-disable-next-line @typescript-eslint/unbound-method
        TestClass.prototype.testMethod,
      );
      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(MfaGuard);
      expect(guards).toContain(RolesGuard);
    });
  });

  describe('Mfa', () => {
    it('should apply JwtAuthGuard and MfaGuard', () => {
      class TestClass {
        @Auth.Mfa()
        testMethod() {}
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const guards = Reflect.getMetadata(
        '__guards__',
        // eslint-disable-next-line @typescript-eslint/unbound-method
        TestClass.prototype.testMethod,
      );
      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(MfaGuard);
    });
  });
});
