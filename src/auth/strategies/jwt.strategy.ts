import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  app_metadata?: {
    role?: string;
  };
  aal?: string;
  amr?: Array<{ method: string; timestamp: number }>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const SUPABASE_PROJECT_ID = configService.getOrThrow<string>(
      'SUPABASE_PROJECT_ID',
    );
    const supabaseUrl = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: 'authenticated',
      issuer: `${supabaseUrl}/auth/v1`,
      algorithms: ['RS256', 'ES256'],

      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.app_metadata?.role || payload.role,
      aal: payload.aal,
      amr: payload.amr,
    };
  }
}
