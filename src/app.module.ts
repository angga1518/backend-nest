import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from './utils/utils.module';
import { HeaderMiddleware } from './middleware/header.middleware';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import * as moment from 'moment-timezone';
import { MainController } from './main.controller';
import { AuthUsersModule } from './auth-users/auth-users.module';
import { User } from './auth-users/auth-users.entity';
import { CommonModule } from './common/common.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD ?? '',
      },
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
    AuthUsersModule,
    UtilsModule,
    CommonModule,
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
