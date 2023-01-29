import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtService {
  constructor(private jwt: Jwt) {}

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async validateUser(decode: any): Promise<any> {
    return this.userRepository.findOne(decode.id);
  }

  public async generateToken(user: User): Promise<string> {
    return this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    );
  }

  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public validate(token: string) {
    return this.jwt.verify(token);
  }
}
