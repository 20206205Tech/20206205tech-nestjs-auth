import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.constant';

describe('AuthConstants', () => {
  it('should have the correct IS_PUBLIC_KEY', () => {
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });

  it('should have the correct ROLES_KEY', () => {
    expect(ROLES_KEY).toBe('roles');
  });
});
