import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  public async create(user: User) {
    return this.repository.save(user);
  }

  public async findAll() {
    return this.repository.find();
  }

  public async findById(id: string) {
    return this.repository.findOne({ where: { id: id } });
  }

  public async findByIds(ids: string[]): Promise<Map<string, User>> {
    const users = await this.repository.findBy({ id: In(ids) });

    const userMap = new Map<string, User>();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    return userMap;
  }

  public async updatePhoneNumber(user: User) {
    return this.repository.update(user.id, { phone_number: user.phone_number });
  }
}
