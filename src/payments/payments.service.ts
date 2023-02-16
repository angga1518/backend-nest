import { Injectable } from '@nestjs/common';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { ResponseUtilService } from 'src/utils/service/response.service';
import { PaymentsClientService } from './payments.clients';
import { CreatePaymentRqDto, CreatePaymentRsDto } from './payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private responseUtil: ResponseUtilService,
    private paymentsClientService: PaymentsClientService,
  ) {}

  public async createPayment(
    request: CreatePaymentRqDto,
  ): Promise<BaseResponse<CreatePaymentRsDto>> {
    const data = {
      external_id: `checkout-demo-${+new Date()}`,
      currency: request.currency,
      amount: request.amount,
      failure_redirect_url: request.failure_redirect_url,
      success_redirect_url: request.success_redirect_url,
      customer: {
        given_names: 'John',
        surname: 'Doe',
        email: 'johndoe@example.com',
        mobile_number: '+6287774441111',
        addresses: [
          {
            city: 'Jakarta Selatan',
            country: 'Indonesia',
            postal_code: '12345',
            state: 'Daerah Khusus Ibukota Jakarta',
            street_line1: 'Jalan Makan',
            street_line2: 'Kecamatan Kebayoran Baru',
          },
        ],
      },
      payment_methods: ['credit_card'],
      customer_notification_preference: {
        invoice_created: ['whatsapp', 'sms', 'email', 'viber'],
        invoice_reminder: ['whatsapp', 'sms', 'email', 'viber'],
        invoice_paid: ['whatsapp', 'sms', 'email', 'viber'],
        invoice_expired: ['whatsapp', 'sms', 'email', 'viber'],
      },
    };

    // Make request to API using PaymentsClientService
    const response = await this.paymentsClientService.createPayment(request);

    // Process response
    // ...

    return this.responseUtil.successOkResponse(response);
  }
}
