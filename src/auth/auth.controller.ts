import { Controller, Post, Body } from '@nestjs/common';
import { RegisterRqDto } from './auth.dto';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() payload: RegisterRqDto) {
    return this.authService.register(payload);
  }
}
