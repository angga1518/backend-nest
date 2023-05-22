import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { SentryExceptionFilter } from './middleware/sentry.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      errorHttpStatusCode: 400,
      always: true,
      forbidUnknownValues: false,
    }),
  );
  app.useLogger(app.get(Logger));
  app.enableCors();

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

  app.useGlobalFilters(new SentryExceptionFilter());

  await app.listen(3000);
}
bootstrap();
