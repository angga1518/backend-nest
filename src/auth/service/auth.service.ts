import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { ResponseUtilService } from 'src/utils/service/response.service';
import { RegisterRqDto, RegisterRsDTO } from '../auth.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private responseUtil: ResponseUtilService,
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
      return this.responseUtil.errorConflictResponse(['e-mail already exist']);
    }

    return this.responseUtil.successResponse({
      name: name,
      email: email,
    });
  }
}
