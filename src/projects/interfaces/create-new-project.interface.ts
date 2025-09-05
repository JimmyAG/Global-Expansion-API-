import { ProjectStatus, Service } from '@database/mysql/entities';

export interface CreateNewProject {
  budget: number;

  country: string;

  status: ProjectStatus;

  user_id: string;

  services_needed: Service[];
}
