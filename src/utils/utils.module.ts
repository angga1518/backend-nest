import { Module } from '@nestjs/common';
import { ResponseUtilService } from './service/response.service';

@Module({
  providers: [ResponseUtilService],
  exports: [ResponseUtilService],
})
export class UtilsModule {}
