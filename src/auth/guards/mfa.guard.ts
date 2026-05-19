import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class MfaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { aal?: string } }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (user.aal !== 'aal2') {
      throw new ForbiddenException('Multi-factor authentication required');
    }

    return true;
  }
}
