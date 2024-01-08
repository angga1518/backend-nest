import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../auth-users.entity';
import { DateUtilService } from 'src/utils/service/dates/dates.service';
import { RedisCache } from 'src/common/redis/redis';

@Injectable()
export class UsersDao {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  private readonly logger = new Logger(UsersDao.name);
  private readonly OTP_REDIS_KEY = 'OTP_USER';

  constructor(
    private readonly redisCache: RedisCache,
    private readonly dateUtil: DateUtilService,
  ) {}

  public async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  public async findAll(): Promise<User[]> {
    this.logger.log(`findAll all users`);
    return await this.repository.find({
      order: { lastUpdated: 'DESC' },
    });
  }

  public async findById(id: string): Promise<User | null> {
    this.logger.log(`findOne user by id ${id}`);
    const user = await this.repository.findOne({ where: { id: id } });
    return user;
  }

  public async findByRole(role: string): Promise<User[]> {
    this.logger.log(`findOne user by role ${role}`);
    const user = await this.repository.find({
      where: { role: role },
      order: { lastUpdated: 'DESC' },
    });
    return user;
  }

  public async findOneByRole(role: string): Promise<User | null> {
    this.logger.log(`findOne user by role ${role}`);
    const user = await this.repository.findOne({ where: { role: role } });
    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`findOne user by email ${email}`);
    const user = await this.repository.findOne({ where: { email: email } });
    return user;
  }

  public async findMapUsersByIds(
    requestIds: string[],
  ): Promise<Map<string, User>> {
    const uniqueUserIds = [...new Set(requestIds)];

    this.logger.log(`find users by ids ${uniqueUserIds}`);
    const users = await this.repository.findBy({ id: In(uniqueUserIds) });

    const userMap = new Map<string, User>();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    return userMap;
  }

  public async findByIds(ids: string[]): Promise<User[]> {
    this.logger.log(`find users by ids ${ids}`);
    return await this.repository.findBy({ id: In(ids) });
  }

  public async updatePassword(
    userId: string,
    encryptedPassword: string,
    lastUpdateBy: string,
  ): Promise<void> {
    this.logger.log(`update user password ${userId}`);
    await this.repository.update(
      {
        id: userId,
      },
      {
        password: encryptedPassword,
        lastUpdated: this.dateUtil.nowJakartaTime(),
        lastUpdateBy: lastUpdateBy,
      },
    );
  }

  // Expiration 15 mins
  public async saveOtpByUserId(userId: string, otp: string) {
    this.logger.log(`save otp redis ${userId}`);
    await this.redisCache.setEx(
      `${this.OTP_REDIS_KEY}_${userId}`,
      otp,
      60 * 15,
    );
  }

  public async getOtpByUserId(userId: string): Promise<string | null> {
    this.logger.log(`get otp redis ${userId}`);
    return await this.redisCache.get(`${this.OTP_REDIS_KEY}_${userId}`);
  }

  public async deleteOtpByUserId(userId: string) {
    this.logger.log(`delete otp redis ${userId}`);
    await this.redisCache.del(`${this.OTP_REDIS_KEY}_${userId}`);
  }
}
