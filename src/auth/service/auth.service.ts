import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { BaseResponse, RegisterRqDto, RegisterRsDTO } from '../auth.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async register({
    email,
    password,
    name,
  }: RegisterRqDto): Promise<BaseResponse<RegisterRsDTO>> {
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = this.jwtService.encodePassword(password);

    try {
      await this.usersService.create(user);
    } catch {
      return {
        status: HttpStatus.CONFLICT,
        error: ['e-mail already exist'],
        data: {
          name: name,
          email: email,
        },
      };
    }

    return {
      status: HttpStatus.CREATED,
      error: [],
      data: {
        name: name,
        email: email,
      },
    };
  }
}
