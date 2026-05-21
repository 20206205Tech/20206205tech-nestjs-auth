import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RequestIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers?: Record<string, string> }>();

    const requestId = request.headers?.['request-id'];

    if (!requestId) {
      throw new BadRequestException('Request-Id header is required');
    }

    return true;
  }
}
