import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ResponseUtilService } from 'src/utils/service/response.service';

@Injectable()
export class PaymentsClientService {
  constructor(
    private responseUtil: ResponseUtilService,
    private readonly httpService: HttpService,
  ) {}

  createPayment(paymentData: any): Observable<AxiosResponse<any>> {
    const url = 'https://dummy-url.com/payments';
    return this.httpService.post(url, paymentData);
  }
}
