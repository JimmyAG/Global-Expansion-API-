import { JWTAuthGuard } from '@app/auth/guards/jwt.guard';
import { Roles } from '@app/auth/guards/roles.decorator';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VendorsServiceAbstract } from './abstracts/vendors.service.abstract';
import { UserRole } from '@database/mysql/entities';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UpdateVendorDto } from './dtos/update-vendor.dto';

@ApiTags('Vendors')
@UseGuards(JWTAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/vendors')
export class VendorsController {
  constructor(
    @Inject(VendorsServiceAbstract)
    private readonly vendorsService: VendorsServiceAbstract,
  ) {}

  @Get('/')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAllVendors() {
    return this.vendorsService.findAllVendors();
  }

  @Get('/:id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  async getVendorById(@Param('id') vendorId: string) {
    return this.vendorsService.findVendorById(vendorId);
  }

  @Post('/new')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 201, description: 'Vendor created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createVendor(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.createVendor(createVendorDto);
  }

  @Put('/:id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Vendor updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  async updateVendor(
    @Param('id') vendorId: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.updateVendor(vendorId, updateVendorDto);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  async deleteVendor(@Param('id') vendorId: string) {
    return this.vendorsService.deleteVendor(vendorId);
  }
}
