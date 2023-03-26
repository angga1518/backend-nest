import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { UtilsModule } from './utils/utils.module';
import { HeaderMiddleware } from './middleware/header.middleware';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import * as moment from 'moment-timezone';
import { MainController } from './main.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: function (req, res) {
          let id = req.headers['x-request-id'];
          if (!id) {
            id = randomUUID();
          }
          res.setHeader('X-Request-Id', id);
          return id;
        },
        redact: [
          'req.headers',
          'req.query',
          'req.params',
          'req.remoteAddress',
          'req.remotePort',
          'res.headers',
        ],
        timestamp: () => `,"time":"${moment().tz('Asia/Bangkok').format()}"`,
      },
    }),
    UsersModule,
    AuthModule,
    UtilsModule,
  ],
  controllers: [MainController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HeaderMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
