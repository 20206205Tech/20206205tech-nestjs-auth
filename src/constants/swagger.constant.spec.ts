import { SWAGGER_AUTH_KEY } from './swagger.constant';

describe('Constants', () => {
  it('should have the correct SWAGGER_AUTH_KEY value', () => {
    // Kiểm tra xem hằng số có đúng bằng 'HTTPBearer' không
    expect(SWAGGER_AUTH_KEY).toBe('HTTPBearer');
  });

  it('should be defined', () => {
    // Kiểm tra xem hằng số có tồn tại không (không bị undefined)
    expect(SWAGGER_AUTH_KEY).toBeDefined();
  });
});
