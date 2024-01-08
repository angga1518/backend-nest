import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UtilsModule } from 'src/utils/utils.module';
import { JwtService } from './service/jwt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth-users/auth-users.entity';
import { AuthGuard } from './auth-users.guard';
import { HttpModule } from '@nestjs/axios';
import { UsersDao } from './dao/users.dao';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    PassportModule,
    UtilsModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    TypeOrmModule.forFeature([User]),
    HttpModule,
    CommonModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, JwtService, AuthGuard, UsersDao],
  exports: [JwtService, AuthGuard, UsersDao],
})
export class AuthUsersModule {}
