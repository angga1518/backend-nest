import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@sendinblue/client';
import 'dotenv/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private client: TransactionalEmailsApi;

  constructor() {
    this.client = new TransactionalEmailsApi();
    const apiKey = process.env.SENDINBLUE_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'SENDINBLUE_API_KEY is not defined',
      );
    }

    this.client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }

  public sendEmail(
    subject: string,
    targets: string[],
    params: any,
    templateId: number,
  ): string {
    const env = process.env.NODE_ENV;
    if (env === 'dev' || env === 'stag') {
      subject = `[TEST] ${subject}`;
    }

    const sendSMTPEmail = new SendSmtpEmail();
    sendSMTPEmail.subject = subject;
    sendSMTPEmail.to = targets.map((target) => ({ email: target }));
    sendSMTPEmail.templateId = templateId;
    sendSMTPEmail.params = params;

    this.logger.log(`sending email with subject ${subject} to ${targets}`);

    this.client.sendTransacEmail(sendSMTPEmail);

    return 'OK';
  }
}
