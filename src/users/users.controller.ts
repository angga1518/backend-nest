import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ResponseUtilService } from 'src/utils/service/responses/responses.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseUtil: ResponseUtilService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.responseUtil.successOkResponse(
      await this.usersService.findAll(),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.responseUtil.successOkResponse(
      await this.usersService.findById(id),
    );
  }
}
