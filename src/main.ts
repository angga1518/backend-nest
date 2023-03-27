import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(3000);
}
bootstrap();
