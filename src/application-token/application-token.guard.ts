import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationTokenService } from './application-token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplicationTokenGuard implements CanActivate {
  constructor(
    private applicationTokenService: ApplicationTokenService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['x-application-token'] as string;

    // Permitir en entorno local
    const isLocalEnv = this.configService.get('NODE_ENV') !== 'production';
    if (isLocalEnv) return true;

    // Validar token de aplicación
    if (!token) {
      throw new UnauthorizedException('No application token provided');
    }

    const validToken =
      await this.applicationTokenService.validateApplicationToken(token);

    if (!validToken) {
      throw new UnauthorizedException('Invalid application token');
    }

    return true;
  }
}
