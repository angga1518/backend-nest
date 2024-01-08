import { Injectable, Logger } from '@nestjs/common';
import { ResponseUtilService } from 'src/utils/service/responses/responses.service';
import { UsersDao } from '../dao/users.dao';
import { ROLE } from '../auth-users.constant';
import { User } from '../auth-users.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly responseUtil: ResponseUtilService,
    private readonly usersDao: UsersDao,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  public async findAll(role: string) {
    this.logger.log(`findAll users by role ${role}`);

    if (role) {
      if (!Object.values(ROLE).includes(role)) {
        this.logger.error(`role ${role} is not valid`);
        return this.responseUtil.errorBadRequestResponse([
          `role ${role} is not valid`,
        ]);
      }
    }

    let userEntities: User[];
    if (role) {
      userEntities = await this.usersDao.findByRole(role);
    } else {
      userEntities = await this.usersDao.findAll();
    }

    return this.responseUtil.successOkResponse(userEntities);
  }

  public async findById(id: string) {
    this.logger.log(`findOne user by id ${id}`);

    const userEntity = await this.usersDao.findById(id);
    if (!userEntity) {
      this.logger.log(`user with id ${id} not found`);
      return this.responseUtil.errorNotFoundResponse([
        `user with id ${id} not found`,
      ]);
    }

    return this.responseUtil.successOkResponse(userEntity);
  }
}
