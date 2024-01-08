import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { User } from 'src/auth-users/auth-users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../auth-users.dto';

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
        role: user.role,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    );
    const refreshToken = this.jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }

  public generateToken(user: User): Token {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    );

    return {
      token: accessToken,
      refreshToken: null,
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
