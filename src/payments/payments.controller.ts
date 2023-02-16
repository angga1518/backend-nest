import { Controller, Post, Body } from '@nestjs/common';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { CreatePaymentRq, CreatePaymentRs } from './payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  private async create(
    @Body() payload: CreatePaymentRq,
  ): Promise<BaseResponse<CreatePaymentRs>> {
    return await this.paymentsService.createPayment(payload);
  }
}
