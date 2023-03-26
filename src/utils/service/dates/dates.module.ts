import { Module } from '@nestjs/common';
import { DateUtilService } from './dates.service';

@Module({
  exports: [DateUtilService],
  providers: [DateUtilService],
})
export class DatesModule {}
