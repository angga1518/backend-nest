import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ContentfulService } from 'src/utils/service/contentful/contentful.service';
import { Entry, EntryCollection } from 'contentful';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(ContentfulService)
  private readonly contentful: ContentfulService;

  public async getFromContentful() {
    const entries: EntryCollection<any> =
      await this.contentful.client.getEntries({
        content_type: 'user',
      });

    // example if want to get only one data
    // const user = await this.contentful.client.getEntry(
    //   {contentful entry id},
    // );

    const users = entries.items.map((entry: Entry<any>) => {
      const user = new User();
      user.id = entry.sys.id;
      user.name = entry.fields['name'];
      user.phone_number = entry.fields['phoneNumber'];
      return user;
    });

    return users;
  }

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
