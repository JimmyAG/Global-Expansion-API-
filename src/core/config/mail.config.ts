import { registerAs } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { join } from 'path';

const { MAIL_HOST, MAIL_PORT, MAIL_SECURE } = process.env;

const config: MailerOptions = {
  transport: {
    host: MAIL_HOST || 'localhost',
    port: parseInt(MAIL_PORT || '1025', 10),
    ignoreTLS: true,
    secure: MAIL_SECURE === 'true',
    // logger: true,
    // debug: true,
  },
  defaults: {
    from: '"No Reply" <no-reply@localhost>',
  },
  preview: false,
  template: {
    dir: join(__dirname, '../../../mail/templates/'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};

export default registerAs('mail', () => config);
