import { Module } from '@nestjs/common';
import { DatesModule } from './service/dates/dates.module';
import { ResponsesModule } from './service/responses/responses.module';
import { ContentfulModule } from './service/contentful/contentful.module';

@Module({
  imports: [DatesModule, ResponsesModule, ContentfulModule],
  exports: [DatesModule, ResponsesModule, ContentfulModule],
})
export class UtilsModule {}
