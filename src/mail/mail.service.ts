import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  @Inject() private readonly mailerService: MailerService;

  async sendMail(data: ISendMailOptions): Promise<SentMessageInfo> {
    try {
      await this.mailerService.sendMail(data);
    } catch (error) {
      Logger.error(JSON.stringify(error));
    }
  }
}
