import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Vendor } from '@database/mysql/entities';
import { VendorsController } from './vendors.controller';
import { vendorsServiceProvider } from './providers/vendors.service.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User, Vendor])],
  controllers: [VendorsController],
  providers: [vendorsServiceProvider],
})
export class VendorsModule {}
