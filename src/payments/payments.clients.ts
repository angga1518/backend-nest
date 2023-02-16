import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { CreatePaymentRqDto } from './payments.dto';

@Injectable()
export class PaymentsClientService {
  constructor(private readonly httpService: HttpService) {}

  // TODO: pisahin dto client dan service
  createPayment(data: CreatePaymentRqDto): Observable<AxiosResponse<any>> {
    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: `${process.env.API_GATEWAY_URL}/v2/invoices`,
      data,
    };
    const authRequestConfig = this.addAuthHeader(requestConfig);
    return this.httpService.request(authRequestConfig);
  }

  getInvoiceData(id: string): Observable<AxiosResponse<any>> {
    const requestConfig: AxiosRequestConfig = {
      method: 'GET',
      url: `${process.env.API_GATEWAY_URL}/v2/invoices/${id}`,
    };
    const authRequestConfig = this.addAuthHeader(requestConfig);
    return this.httpService.request(authRequestConfig);
  }

  private getBasicAuthHeader(): string {
    const username = process.env.API_KEY;
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
