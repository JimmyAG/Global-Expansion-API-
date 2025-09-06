import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './core/config/database.config';
import authConfig from './core/config/auth.config';
import bullmqConfig from './core/config/bullmq.config';
import { User } from '@database/mysql/entities';
import { QueueOptions } from 'bullmq';
import { BullModule } from '@nestjs/bullmq';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { VendorsModule } from './vendors/vendors.module';
import { MailModule } from './mail/mail.module';
import { ResearchDocumentsModule } from './research-documents/research-documents.module';
import { MatchesModule } from './matches/matches.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, bullmqConfig, databaseConfig],
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mysqlConfig =
          configService.get<TypeOrmModuleOptions>('database.mysql');

        if (!mysqlConfig) {
          throw new Error('MySQL configuration not found');
        }

        return mysqlConfig;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoConfig =
          configService.get<MongooseModuleFactoryOptions>('database.mongo');

        if (!mongoConfig) {
          throw new Error('MongoDB configuration not found');
        }

        return mongoConfig;
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const bullmqConfig = configService.get<QueueOptions>('bullmq');

        if (!bullmqConfig) {
          throw new Error('BullMQ configuration not found');
        }

        return bullmqConfig;
      },
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    MailModule,
    UsersModule,
    ProjectsModule,
    VendorsModule,
    ResearchDocumentsModule,
    MatchesModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
