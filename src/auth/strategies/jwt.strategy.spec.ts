import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(() => 'test-secret'),
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('test-project-id'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object from payload with app_metadata role', () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        app_metadata: {
          role: 'admin',
        },
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        role: 'admin',
      });
    });

    it('should return user object from payload with root role', () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: 'authenticated',
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        role: 'authenticated',
      });
    });

    it('should prioritize app_metadata role', () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: 'authenticated',
        app_metadata: {
          role: 'admin',
        },
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        role: 'admin',
      });
    });
  });
});
