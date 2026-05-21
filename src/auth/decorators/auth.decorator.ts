import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_AUTH_KEY } from '../../constants/swagger.constant';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../constants/auth.constant';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { MfaGuard } from '../guards/mfa.guard';
import { RequestIdGuard } from '../guards/request-id.guard';

export const Auth = {
  Public: () => applyDecorators(SetMetadata(IS_PUBLIC_KEY, true)),

  User: () =>
    applyDecorators(
      UseGuards(RequestIdGuard, JwtAuthGuard, MfaGuard),

      ApiBearerAuth(SWAGGER_AUTH_KEY),

      ApiUnauthorizedResponse({ description: 'Unauthorized' }),

      ApiForbiddenResponse({
        description: 'Forbidden - Requires Multi-factor authentication',
      }),
    ),

  Admin: () =>
    applyDecorators(
      UseGuards(RequestIdGuard, JwtAuthGuard, MfaGuard, RolesGuard),
      SetMetadata(ROLES_KEY, [UserRole.ADMIN]),

      ApiBearerAuth(SWAGGER_AUTH_KEY),

      ApiUnauthorizedResponse({ description: 'Unauthorized' }),

      ApiForbiddenResponse({
        description:
          'Forbidden - Requires Multi-factor authentication and Admin role',
      }),
    ),

  Mfa: () =>
    applyDecorators(
      UseGuards(RequestIdGuard, JwtAuthGuard, MfaGuard),

      ApiBearerAuth(SWAGGER_AUTH_KEY),

      ApiUnauthorizedResponse({ description: 'Unauthorized' }),

      ApiForbiddenResponse({
        description: 'Forbidden - Requires Multi-factor authentication',
      }),
    ),
};
