import { Match, Project } from '@database/mysql/entities';
import { SanitizedRequestUser } from '@app/auth/interfaces/sanitized-typeorm-user.type';
import { CreateNewProject } from '../interfaces/create-new-project.interface';
import { UpdateProject } from '../interfaces/update-project.type';

export abstract class ProjectsServiceAbstract {
  abstract createProject(
    createProjectDto: CreateNewProject,
    user: Partial<SanitizedRequestUser>,
  ): Promise<Project>;

  abstract findProjectsByUserId(userId: string): Promise<Project[]>;

  abstract updateProject(
    userId: string,
    projectId: string,
    updateProjectDto: UpdateProject,
  ): Promise<Project>;

  abstract deleteProject(
    userId: string,
    projectId: string,
  ): Promise<{ message: string }>;

  abstract getProjectMatchesById(
    userId: string,
    projectId: string,
  ): Promise<Match[]>;
}
