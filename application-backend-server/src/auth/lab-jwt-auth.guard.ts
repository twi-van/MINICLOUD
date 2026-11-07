import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

/** Token của realm theo MSSV (flask-app), tách khỏi realm minicloud của MiniHome. */
@Injectable()
export class LabJwtAuthGuard implements CanActivate {
  private readonly issuer =
    process.env.KEYCLOAK_LAB_ISSUER ??
    'http://localhost/auth/realms/realm_52400211';

  private readonly jwksUri =
    process.env.KEYCLOAK_LAB_JWKS_URI ??
    'http://authentication-identity-server:8080/auth/realms/realm_52400211/protocol/openid-connect/certs';

  private jwks = createRemoteJWKSet(new URL(this.jwksUri));

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: Record<string, unknown>;
    }>();

    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
      });
      request.user = payload as Record<string, unknown>;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
