import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly issuer =
    process.env.KEYCLOAK_ISSUER ?? 'http://localhost/auth/realms/minicloud';

  private readonly jwksUri =
    process.env.KEYCLOAK_JWKS_URI ??
    'http://authentication-identity-server:8080/auth/realms/minicloud/protocol/openid-connect/certs';

  private jwks = createRemoteJWKSet(new URL(this.jwksUri));

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: Record<string, unknown>;
    }>();

    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Thiếu Authorization Bearer. Hãy đăng nhập Keycloak rồi gọi lại.',
      );
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Token rỗng.');
    }

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
      });
      // Gắn payload vào request để controller lấy sub / preferred_username
      request.user = payload as Record<string, unknown>;
      return true;
    } catch {
      throw new UnauthorizedException(
        'Token không hợp lệ hoặc đã hết hạn (issuer/JWKS Keycloak).',
      );
    }
  }
}
