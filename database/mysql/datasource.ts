import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

const envFilePath = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';

dotenvConfig({ path: envFilePath });

export const MySQLDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.MYSQL_LOCAL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../../database/mysql/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
