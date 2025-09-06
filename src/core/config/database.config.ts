import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { MongooseModuleOptions } from '@nestjs/mongoose';

const envFilePath = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';

dotenvConfig({ path: envFilePath });

const isDocker = process.env.NODE_ENV === 'docker';

export const mysqlConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: isDocker ? 'mysql-db' : 'localhost',
  port: Number(process.env.MYSQL_LOCAL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    __dirname + '/../../../database/mysql/entities/**/*.entity{.ts,.js}',
  ],
  migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
};

export const mongodbConfig: MongooseModuleOptions = {
  uri: isDocker
    ? `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongodb:${process.env.MONGO_LOCAL_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`
    : `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_LOCAL_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`,
};

export default registerAs('database', () => ({
  mysql: mysqlConfig,
  mongo: mongodbConfig,
}));

export const connectionSource = new DataSource(mysqlConfig);
