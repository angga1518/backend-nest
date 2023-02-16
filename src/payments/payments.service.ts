import { Injectable } from '@nestjs/common';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { ResponseUtilService } from 'src/utils/service/response.service';
import { PaymentsClientService } from './payments.clients';
import { CreatePaymentRq, CreatePaymentRs } from './payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private responseUtil: ResponseUtilService,
    private paymentsClientService: PaymentsClientService,
  ) {}

  public async createPayment(
    request: CreatePaymentRq,
  ): Promise<BaseResponse<CreatePaymentRs>> {
    // Make request to API using PaymentsClientService
    const response = await this.paymentsClientService.createPayment(request);

    // Process response
    // ...

    return this.responseUtil.successOkResponse(response);
  }
}
