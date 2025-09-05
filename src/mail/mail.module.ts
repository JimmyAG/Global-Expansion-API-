import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import mailConfig from '../core/config/mail.config';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerOptions => {
        const mailerOptions = configService.get<MailerOptions>('mail');

        if (!mailerOptions) {
          throw new Error('Mail configuration not found');
        }

        return mailerOptions;
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
