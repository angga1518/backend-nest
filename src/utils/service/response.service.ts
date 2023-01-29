import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseResponse } from '../dto/response.dto';

@Injectable()
export class ResponseUtilService {
  public successOkResponse(data: any): BaseResponse<any> {
    return {
      status: HttpStatus.OK,
      error: [],
      data: data,
    };
  }

  public successCreatedResponse(data: any): BaseResponse<any> {
    return {
      status: HttpStatus.CREATED,
      error: [],
      data: data,
    };
  }

  public errorConflictResponse(error: string[]): BaseResponse<any> {
    return {
      status: HttpStatus.CONFLICT,
      error: error,
      data: null,
    };
  }

  public errorBadRequestResponse(error: string[]): BaseResponse<any> {
    return {
      status: HttpStatus.BAD_REQUEST,
      error: error,
      data: null,
    };
  }

  public errorNotFoundResponse(error: string[]): BaseResponse<any> {
    return {
      status: HttpStatus.NOT_FOUND,
      error: error,
      data: null,
    };
  }
}
