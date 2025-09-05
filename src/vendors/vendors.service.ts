import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorsServiceAbstract } from './abstracts/vendors.service.abstract';
import { Vendor } from '@database/mysql/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateVendor } from './interfaces/update-vendor.type';
import { CreateNewVendor } from './interfaces/create-new-vendor.interface';

@Injectable()
export class VendorsService extends VendorsServiceAbstract {
  constructor(
    @InjectRepository(Vendor) private readonly vendorsRepo: Repository<Vendor>,
  ) {
    super();
  }

  async createVendor(createVendorDto: CreateNewVendor): Promise<Vendor> {
    console.log(createVendorDto);
    const newVendor = await this.vendorsRepo.save(createVendorDto);

    console.log(newVendor);

    return newVendor;
  }

  async findAllVendors(): Promise<Vendor[]> {
    const vendors = await this.vendorsRepo.find();

    return vendors;
  }

  async findVendorById(vendorId: string): Promise<Vendor> {
    const vendor = await this.vendorsRepo.findOne({
      where: {
        id: vendorId,
      },
    });

    if (!vendor) throw new NotFoundException();

    return vendor;
  }

  async updateVendor(
    vendorId: string,
    updateVendorDto: UpdateVendor,
  ): Promise<Vendor> {
    const vendor = await this.vendorsRepo.findOne({
      where: {
        id: vendorId,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const mergedVendor = this.vendorsRepo.merge(vendor, updateVendorDto);

    const updatedVendor = await this.vendorsRepo.save(mergedVendor);

    return updatedVendor;
  }

  async deleteVendor(vendorId: string): Promise<{ message: string }> {
    const deletResult = await this.vendorsRepo.delete({
      id: vendorId,
    });

    if (deletResult && deletResult.affected === 1) {
      return { message: 'Vendor deleted successfully.' };
    } else {
      return { message: 'An error occurred' };
    }
  }
}
