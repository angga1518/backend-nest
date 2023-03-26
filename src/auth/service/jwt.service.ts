import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../auth.dto';

@Injectable()
export class JwtService {
  constructor(private jwt: Jwt) {}

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async validateUser(decode: any): Promise<any> {
    return this.userRepository.findOne(decode.id);
  }

  public generateTokenWithRefreshToken(user: User): Token {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        image_url: user.image_url,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    );
    const refreshToken = this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        image_url: user.image_url,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public generateToken(user: User): Token {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        image_url: user.image_url,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    );

    return {
      token: accessToken,
      refresh_token: null,
    };
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
