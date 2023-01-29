import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtService {
  constructor(private jwt: Jwt, private usersService: UsersService) {}

  public async validateUser(decode: any): Promise<any> {
    return this.usersService.findOne(decode.id);
  }

  public async generateToken(user: User): Promise<string> {
    return this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      {
        expiresIn: '1h',
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
