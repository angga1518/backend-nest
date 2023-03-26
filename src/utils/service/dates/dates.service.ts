import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilService {
  public nowJakartaTime(): Date {
    const options = { timeZone: 'Asia/Jakarta' };
    const dateString = new Date().toLocaleString('en-US', options);
    return new Date(dateString);
  }
}
