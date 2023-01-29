import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { ResponseUtilService } from 'src/utils/service/response.service';
import { Repository } from 'typeorm';
import {
  LoginRqDto,
  LoginRsDTO,
  RegisterRqDto,
  RegisterRsDTO,
} from '../auth.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private responseUtil: ResponseUtilService,
    private jwtService: JwtService,
  ) {}

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

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
      await this.userRepository.create(user);
    } catch {
      return this.responseUtil.errorConflictResponse(['e-mail already exist']);
    }

    return this.responseUtil.successResponse({
      name: name,
      email: email,
    });
  }

  public async login({
    email,
    password,
  }: LoginRqDto): Promise<BaseResponse<LoginRsDTO>> {
    const user: User | null = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return this.responseUtil.errorNotFoundResponse(['account not found']);
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return this.responseUtil.errorBadRequestResponse(['wrong password']);
    }

    const token = await this.jwtService.generateToken(user);

    return this.responseUtil.successResponse({
      token: token,
    });
  }
}
