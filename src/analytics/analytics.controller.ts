import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { JWTAuthGuard } from '@app/auth/guards/jwt.guard';
import { Roles } from '@app/auth/guards/roles.decorator';
import { UserRole } from '@database/mysql/entities';

@ApiTags('Analytics')
@Controller('/analytics')
@UseGuards(JWTAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @Roles(UserRole.ADMIN)
  async getTopVendorsPerCountry() {
    return this.analyticsService.getTopVendorsPerCountry();
  }
}
