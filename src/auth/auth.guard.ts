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

    // set user id to request
    req.userId = decode.id;

    return true;
  }
}
