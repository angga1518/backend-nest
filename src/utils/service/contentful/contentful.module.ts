import { Module } from '@nestjs/common';
import { ContentfulService } from './contentful.service';

@Module({
  exports: [ContentfulService],
  providers: [ContentfulService],
})
export class ContentfulModule {}
