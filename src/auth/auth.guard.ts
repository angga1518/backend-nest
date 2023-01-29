import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './service/jwt.service';
import 'dotenv/config';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | never {
    const req: any = context.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length != 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    let decode: any;
    try {
      // validate token
      decode = await this.jwtService.validate(token);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (!decode) {
      throw new UnauthorizedException();
    }

    // set user id to request
    req.userId = decode.id;

    return true;
  }
}
