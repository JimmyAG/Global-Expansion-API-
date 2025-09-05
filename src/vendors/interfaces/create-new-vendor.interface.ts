import { Service } from '@database/mysql/entities';

export interface CreateNewVendor {
  name: string;

  rating: number;

  response_sla_hours: number;

  countries_supported: string[];

  services_offered: Service[];
}
