import { Vendor } from '@database/mysql/entities';
import { UpdateVendorDto } from '../dtos/update-vendor.dto';
import { CreateVendorDto } from '../dtos/create-vendor.dto';

export abstract class VendorsServiceAbstract {
  abstract createVendor(createVendorDto: CreateVendorDto): Promise<Vendor>;
  abstract findAllVendors(): Promise<Vendor[]>;
  abstract findVendorById(vendorId: string): Promise<Vendor>;
  abstract updateVendor(
    vendorId: string,
    updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor>;
  abstract deleteVendor(vendorId: string): Promise<{ message: string }>;
}
