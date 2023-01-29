import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRqDto } from './dto/registerRq.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() payload: RegisterRqDto) {
    return this.authService.register(payload);
  }
}
