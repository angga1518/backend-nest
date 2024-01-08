import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './service/jwt.service';
import 'dotenv/config';
import { ROLE } from 'src/auth-users/auth-users.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  private readonly TAG = 'AuthGuard';

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | never {
    const req: any = context.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      this.logger.error(`${this.TAG} authorization header is missing`);
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length != 2) {
      this.logger.error(`${this.TAG} bearer token is invalid`);
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    let decode: any;
    try {
      // validate token
      decode = await this.jwtService.validate(token);
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }

    if (!decode) {
      this.logger.error(`${this.TAG} validate token failed`);
      throw new UnauthorizedException();
    }

    // set user id and role to request
    req.userId = decode.id;
    req.role = decode.role;

    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  private readonly TAG = 'AdminGuard';

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | never {
    const req: any = context.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];
    const apiKey: string = req.headers['api-key'];

    if (!authorization && !apiKey) {
      this.logger.error(`${this.TAG} authorization header is missing`);
      throw new UnauthorizedException();
    }

    if (authorization) {
      const decode = await this.validateToken(authorization);

      // set user id to request
      req.userId = decode.id;
    } else if (apiKey) {
      this.validateApiKey(apiKey);
    }

    return true;
  }

  private validateApiKey(apiKey: string): void {
    if (!process.env.AUTH_API_KEY || apiKey !== process.env.AUTH_API_KEY) {
      this.logger.error(`${this.TAG} api key is invalid`);
      throw new UnauthorizedException();
    }
  }

  private async validateToken(authorization: string): Promise<any> {
    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length != 2) {
      this.logger.error(`${this.TAG} bearer token is invalid`);
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    let decode: any;
    try {
      // validate token
      decode = await this.jwtService.validate(token);
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }

    if (!decode) {
      this.logger.error(`${this.TAG} validate token failed`);
      throw new UnauthorizedException();
    }

    if (decode.role !== ROLE.ADMIN) {
      this.logger.error(
        `${this.TAG} user is not eligible, current role ${decode.role}`,
      );
      throw new UnauthorizedException();
    }

    return decode;
  }
}
