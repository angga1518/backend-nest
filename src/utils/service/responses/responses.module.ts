import { Module } from '@nestjs/common';
import { ResponseUtilService } from './responses.service';

@Module({
  exports: [ResponseUtilService],
  providers: [ResponseUtilService],
})
export class ResponsesModule {}
