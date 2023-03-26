import { Controller, Post, Body } from '@nestjs/common';
import { BaseResponse } from 'src/utils/dto/response.dto';
import {
  GoogleAuthDto,
  LoginRqDto,
  LoginRsDTO,
  RefreshAccessTokenRqDto,
  RefreshAccessTokenRsDto,
  RegisterRqDto,
  RegisterRsDTO,
} from './auth.dto';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  private register(
    @Body() payload: RegisterRqDto,
  ): Promise<BaseResponse<RegisterRsDTO>> {
    return this.authService.register(payload);
  }

  @Post('login')
  private login(@Body() body: LoginRqDto): Promise<BaseResponse<LoginRsDTO>> {
    return this.authService.login(body);
  }

  @Post('refresh')
  private refreshAccessToken(
    @Body() body: RefreshAccessTokenRqDto,
  ): Promise<BaseResponse<RefreshAccessTokenRsDto>> {
    return this.authService.refreshAccessToken(body);
  }

  @Post('google')
  private googleAuth(
    @Body() body: GoogleAuthDto,
  ): Promise<BaseResponse<LoginRsDTO>> {
    return this.authService.googleAuth(body);
  }
}
