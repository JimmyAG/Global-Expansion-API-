import { UsersServiceAbstract } from '../abstracts/users.service.abstract';
import { UsersService } from '../services/users.service';

export const userServiceProvider = {
  provide: UsersServiceAbstract,
  useClass: UsersService,
};
