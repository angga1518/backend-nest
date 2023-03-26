import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from 'src/utils/utils.module';
import { PaymentsClientService } from './payments.clients';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UtilsModule,
  ],
  providers: [PaymentsService, PaymentsClientService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
