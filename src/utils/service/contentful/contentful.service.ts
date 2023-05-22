import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContentfulClientApi, createClient } from 'contentful';

@Injectable()
export class ContentfulService {
  public client: ContentfulClientApi;

  constructor() {
    // validate environment variables
    if (
      !process.env.CONTENTFUL_SPACE_ID ||
      !process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ||
      !process.env.CONTENTFUL_PREVIEW_HOST
    ) {
      throw new InternalServerErrorException(
        'Contentful environment variables is not defined',
      );
    }

    this.client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      host: process.env.CONTENTFUL_PREVIEW_HOST,
    });
  }
}
