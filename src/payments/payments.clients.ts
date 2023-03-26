import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

import { catchError, lastValueFrom, map, of } from 'rxjs';
import { PaymentRqDto } from './payments.dto';

@Injectable()
export class PaymentsClientService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(PaymentsClientService.name);

  public async createPayment(data: PaymentRqDto): Promise<any> {
    this.logger.log('create payment');
    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: `${process.env.XENDIT_API_GATEWAY_URL}/v2/invoices`,
      data,
    };
    const authRequestConfig = this.addAuthHeader(requestConfig);
    return this.hitXenditHttpClient(authRequestConfig);
  }

  public async getInvoiceData(invoiceId: string): Promise<any> {
    const requestConfig: AxiosRequestConfig = {
      method: 'GET',
      url: `${process.env.XENDIT_API_GATEWAY_URL}/v2/invoices/${invoiceId}`,
    };
    const authRequestConfig = this.addAuthHeader(requestConfig);

    return this.hitXenditHttpClient(authRequestConfig);
  }

  private async hitXenditHttpClient(
    requestConfig: AxiosRequestConfig<any>,
  ): Promise<any> {
    return await lastValueFrom(
      this.httpService.request(requestConfig).pipe(
        map((response) => response.data),
        catchError((e) => {
          this.logger.warn(
            `Error hit xendit: ${JSON.stringify(e.response.data)}`,
          );
          return of({
            status: e.response.status,
            error: [e.response.data],
            data: null,
          });
        }),
      ),
    );
  }

  private getBasicAuthHeader(): string {
    const username = process.env.XENDIT_API_KEY;
    const password = '';
    const authString = `${username}:${password}`;
    const base64AuthString = Buffer.from(authString).toString('base64');
    return `Basic ${base64AuthString}`;
  }

  public addAuthHeader(requestConfig: AxiosRequestConfig): AxiosRequestConfig {
    const headers = requestConfig.headers ?? {};
    headers['Authorization'] = this.getBasicAuthHeader();
    requestConfig.headers = headers;
    return requestConfig;
  }
}
