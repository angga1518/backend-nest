import {
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(UnauthorizedException, InternalServerErrorException)
export class BackendExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BackendExceptionFilter.name);

  catch(exception: any, host: import('@nestjs/common').ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(`Exception caught: ${exception}`);

    if (exception instanceof UnauthorizedException) {
      return response.status(401).json({
        statusCode: 401,
        message: ['Unauthorized'],
        error: 'Unauthorized',
        data: null,
      });
    }

    return this.return500Error(response);
  }

  private return500Error(response: any) {
    return response.status(500).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal server error'],
      error: 'Internal server error',
      data: null,
    });
  }
}
