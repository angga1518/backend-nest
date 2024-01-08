import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { BaseResponse } from 'src/utils/dto/response.dto';
import {
  LoginRqDto,
  LoginRsDTO,
  RefreshAccessTokenRqDto,
  RefreshAccessTokenRsDto,
  RegisterRqDto,
  RegisterRsDTO,
  RequestOtpRqDto,
  ResetPasswordRqDto,
} from '../auth-users.dto';
import { AuthService } from '../service/auth.service';
import { AdminGuard } from '../auth-users.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Post('register')
  @UseGuards(AdminGuard)
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

  @Post('request-otp')
  private requestOtp(
    @Body() body: RequestOtpRqDto,
  ): Promise<BaseResponse<string>> {
    this.logger.log(
      `${AuthController.name} request otp for account: ${body.email}`,
    );
    return this.authService.requestOtp(body.email);
  }

  @Post('reset-password')
  private resetPassword(
    @Body() body: ResetPasswordRqDto,
  ): Promise<BaseResponse<string>> {
    this.logger.log(
      `${AuthController.name} request otp for account: ${body.email}`,
    );
    return this.authService.resetPassword(body);
  }
}
