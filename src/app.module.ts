import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './core/config/database.config';
import authConfig from './core/config/auth.config';
import { User } from '@database/mysql/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, databaseConfig],
      envFilePath: '.env',
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
    TypeOrmModule.forFeature([User]),
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
