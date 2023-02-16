import { Injectable } from '@nestjs/common';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { ResponseUtilService } from 'src/utils/service/response.service';
import { CreatePaymentRq, CreatePaymentRs } from './payments.dto';

@Injectable()
export class PaymentsClientService {
  constructor(private responseUtil: ResponseUtilService) {}

  public async createPayment({
    email,
    password,
    name,
  }: CreatePaymentRq): Promise<BaseResponse<CreatePaymentRs>> {
    return this.responseUtil.successCreatedResponse({
      name: name,
      email: email,
    });
  }
}
