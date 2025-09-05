import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsServiceAbstract } from './abstracts/projects.service.abstract';
import { Match, Project } from '@database/mysql/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '@app/mail/mail.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SanitizedRequestUser } from '@app/auth/interfaces/sanitized-typeorm-user.type';
import { CreateNewProject } from './interfaces/create-new-project.interface';
import { UpdateProject } from './interfaces/update-project.type';

@Injectable()
export class ProjectsService extends ProjectsServiceAbstract {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @Inject(MailService) private readonly mailService: MailService,
  ) {
    super();
  }

  async createProject(
    createProjectDto: CreateNewProject,
    user: SanitizedRequestUser,
  ): Promise<Project> {
    const newProject = await this.projectsRepo.save(createProjectDto);
    const emailText = `Congratulations a new project was created successfully\n You will receive a mail shortly once you get matched with a compatible vendor`;

    const mailData: ISendMailOptions = {
      from: '"No Reply" <no-reply@localhost>',
      to: user.contact_email,
      subject: 'New project was created',
      text: emailText,
      template: 'create-project',
      context: {
        name: user.username,
        message: emailText,
      },
    };

    await this.mailService.sendMail(mailData);

    return newProject;
  }

  async findProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await this.projectsRepo.find({
      where: {
        user_id: userId,
      },
    });

    return projects;
  }

  async getProjectMatchesById(
    userId: string,
    projectId: string,
  ): Promise<Match[]> {
    const projectWithMatches = await this.projectsRepo.findOne({
      where: {
        id: projectId,
        user_id: userId,
      },
      select: {
        matches: true,
      },
    });

    if (!projectWithMatches) {
      throw new NotFoundException();
    }

    return projectWithMatches.matches || [];
  }

  async updateProject(
    userId: string,
    projectId: string,
    updateProjectDto: UpdateProject,
  ): Promise<Project> {
    const project = await this.projectsRepo.findOne({
      where: {
        id: projectId,
        user_id: userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const mergedProject = this.projectsRepo.merge(project, updateProjectDto);

    const updatedProject = await this.projectsRepo.save(mergedProject);

    return updatedProject;
  }

  async deleteProject(
    userId: string,
    projectId: string,
  ): Promise<{ message: string }> {
    const deletResult = await this.projectsRepo.delete({
      id: projectId,
      user_id: userId,
    });

    if (deletResult && deletResult.affected === 1) {
      return { message: 'Project deleted successfully.' };
    } else {
      return { message: 'An error occurred' };
    }
  }
}
