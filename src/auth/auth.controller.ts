import { Controller, Post, Body } from '@nestjs/common';
import { BaseResponse } from 'src/utils/dto/response.dto';
import {
  LoginRqDto,
  LoginRsDTO,
  RegisterRqDto,
  RegisterRsDTO,
} from './auth.dto';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  private async register(
    @Body() payload: RegisterRqDto,
  ): Promise<BaseResponse<RegisterRsDTO>> {
    return await this.authService.register(payload);
  }

  @Post('login')
  private async login(
    @Body() body: LoginRqDto,
  ): Promise<BaseResponse<LoginRsDTO>> {
    return this.authService.login(body);
  }
}
