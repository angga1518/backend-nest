import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

import { catchError, lastValueFrom, map, of } from 'rxjs';
import { PaymentRqDto } from './payments.dto';

@Injectable()
export class PaymentsClientService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(PaymentsClientService.name);
  private readonly sandboxUrl = 'https://app.sandbox.midtrans.com';
  private readonly prodUrl = 'https://app.midtrans.com';

  private getBaseUrl() {
    if (process.env.NODE_ENV === 'prod') {
      return this.prodUrl;
    }
    return this.sandboxUrl;
  }

  public async createPayment(data: PaymentRqDto): Promise<any> {
    this.logger.log('create payment');

    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: `${this.getBaseUrl()}/snap/v1/transactions`,
      data,
    };
    const authRequestConfig = this.addAuthHeader(requestConfig);
    return this.hitMidtransHttpClient(authRequestConfig);
  }

  private async hitMidtransHttpClient(
    requestConfig: AxiosRequestConfig<any>,
  ): Promise<any> {
    return await lastValueFrom(
      this.httpService.request(requestConfig).pipe(
        map((response) => response.data),
        catchError((e) => {
          this.logger.warn(
            `Error hit midtrans: ${JSON.stringify(e.response.data)}`,
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
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authString = `${serverKey}:`;
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
