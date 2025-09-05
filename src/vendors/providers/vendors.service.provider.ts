import { VendorsServiceAbstract } from '../abstracts/vendors.service.abstract';
import { VendorsService } from '../vendors.service';

export const vendorsServiceProvider = {
  provide: VendorsServiceAbstract,
  useClass: VendorsService,
};
