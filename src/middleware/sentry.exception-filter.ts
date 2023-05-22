import {
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch(UnauthorizedException, InternalServerErrorException)
export class SentryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryExceptionFilter.name);

  catch(exception: any, host: import('@nestjs/common').ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(`Exception caught: ${exception}`);

    if (exception instanceof UnauthorizedException) {
      return response.status(401).json({
        status: 401,
        error: 'Unauthorized',
      });
    }

    // if environment is dev, dont send to sentry
    if (process.env.NODE_ENV === 'dev') {
      return this.return500Error(response);
    }

    Sentry.captureException(exception);
    return this.return500Error(response);
  }

  private return500Error(response: any) {
    return response.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
}
