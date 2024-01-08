import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth-users/auth-users.guard';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(UsersController.name);

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query('role') role: string) {
    this.logger.log(`findAll users by role ${role}`);
    return await this.usersService.findAll(role);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    this.logger.log(`findOne user by id ${id}`);
    return await this.usersService.findById(id);
  }
}
