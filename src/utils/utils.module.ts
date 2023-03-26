import { Module } from '@nestjs/common';
import { DatesModule } from './service/dates/dates.module';
import { ResponsesModule } from './service/responses/responses.module';

@Module({
  imports: [DatesModule, ResponsesModule],
  exports: [DatesModule, ResponsesModule],
})
export class UtilsModule {}
