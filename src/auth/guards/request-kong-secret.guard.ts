import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RequestKongSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (
      process.env.ENVIRONMENT === 'development' ||
      process.env.ENVIRONMENT === 'test'
    )
      return true;

    const request = context
      .switchToHttp()
      .getRequest<{ headers?: Record<string, string> }>();

    const kongSecret = request.headers?.['request-kong-secret'];
    const expectedSecret = process.env.REQUEST_KONG_SECRET;

    if (!kongSecret || kongSecret !== expectedSecret) {
      throw new UnauthorizedException('Invalid or missing Request-Kong-Secret');
    }

    return true;
  }
}
