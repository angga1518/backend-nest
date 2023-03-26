import { Module } from '@nestjs/common';
import { DatesModule } from './service/dates/dates.module';
import { MailModule } from './service/mail/mail.module';
import { ResponsesModule } from './service/responses/responses.module';

@Module({
  imports: [DatesModule, ResponsesModule, MailModule],
  exports: [DatesModule, ResponsesModule, MailModule],
})
export class UtilsModule {}
