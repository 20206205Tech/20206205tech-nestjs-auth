import { UserRole } from './user-role.enum';

describe('UserRole', () => {
  it('should have ADMIN role', () => {
    expect(UserRole.ADMIN).toBe('admin');
  });

  it('should have USER role', () => {
    expect(UserRole.USER).toBe('authenticated');
  });
});
