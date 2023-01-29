import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseResponse } from '../dto/response.dto';

@Injectable()
export class ResponseUtilService {
  public successResponse(data: any): BaseResponse<any> {
    return {
      status: HttpStatus.CREATED,
      error: [],
      data,
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
}
