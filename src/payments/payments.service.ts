import { Injectable, Logger } from '@nestjs/common';

import { BaseResponse } from 'src/utils/dto/response.dto';
import { ResponseUtilService } from 'src/utils/service/responses/responses.service';
import { PaymentsClientService } from './payments.clients';
import { PaymentRqDto } from './payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly responseUtil: ResponseUtilService,
    private readonly paymentsClientService: PaymentsClientService,
  ) {}

  private readonly logger = new Logger(PaymentsService.name);

  private readonly tag = 'PaymentsService';

  public async createPayment(
    paymentRq: PaymentRqDto,
  ): Promise<BaseResponse<any>> {
    this.logger.log(
      `${this.tag} create invoice request: ${JSON.stringify(paymentRq)}`,
    );
    const response = await this.paymentsClientService.createPayment(paymentRq);
    if (response.error) {
      return this.responseUtil.errorBadRequestResponse(response.error);
    }

    this.logger.log(
      `${this.tag} success create invoice: ${JSON.stringify(response)}`,
    );

    return this.responseUtil.successOkResponse(response);
  }
}
