import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  public async findOne(id: number) {
    return this.repository.findOne({ where: { id: id } });
  }
}
