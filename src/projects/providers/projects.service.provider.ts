import { ProjectsServiceAbstract } from '../abstracts/projects.service.abstract';
import { ProjectsService } from '../projects.service';

export const projectServiceProvider = {
  provide: ProjectsServiceAbstract,
  useClass: ProjectsService,
};
