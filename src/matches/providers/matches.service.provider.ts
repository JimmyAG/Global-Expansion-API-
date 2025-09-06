import { MatchesServiceAbstract } from '../abstracts/matches.service.abstract';
import { MatchesService } from '../matches.service';

export const matchesServiceProvider = {
  provide: MatchesServiceAbstract,
  useClass: MatchesService,
};
