import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseResponse } from '../../dto/response.dto';

@Injectable()
export class ResponseUtilService {
  public successOkResponse(data: any): BaseResponse<any> {
    return {
      statusCode: HttpStatus.OK,
      message: null,
      error: null,
      data: data,
    };
  }

  public successCreatedResponse(data: any): BaseResponse<any> {
    return {
      statusCode: HttpStatus.CREATED,
      message: null,
      error: null,
      data: data,
    };
  }

  public errorInternalServerErrorResponse(
    errorMessage: string[],
  ): BaseResponse<any> {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      error: 'Internal Server Error',
      data: null,
    };
  }

  public errorConflictResponse(errorMessage: string[]): BaseResponse<any> {
    return {
      statusCode: HttpStatus.CONFLICT,
      message: errorMessage,
      error: 'Error Entity Conflict',
      data: null,
    };
  }

  public errorBadRequestResponse(errorMessage: string[]): BaseResponse<any> {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: errorMessage,
      error: 'Bad Request',
      data: null,
    };
  }

  public errorNotFoundResponse(errorMessage: string[]): BaseResponse<any> {
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: errorMessage,
      error: 'Not Found',
      data: null,
    };
  }
}
