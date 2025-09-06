import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MatchesServiceAbstract } from './abstracts/matches.service.abstract';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MySQLDataSource } from '@database/mysql/datasource';
import { MailService } from '@app/mail/mail.service';
import { Project, ProjectStatus } from '@database/mysql/entities';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Injectable()
export class MatchesService extends MatchesServiceAbstract {
  constructor(
    @InjectDataSource(MySQLDataSource) private readonly dataSource: DataSource,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @Inject(MailService) private readonly mailService: MailService,
  ) {
    super();
  }

  async rebuildProjectMatches(projectId: string) {
    const project = await this.projectRepo.findOne({
      where: {
        id: projectId,
      },
      relations: { user: true },
      select: {
        user: { contact_email: true, username: true },
      },
    });

    if (!project) throw new NotFoundException();

    const queryResult = await this.dataSource.query(
      `CALL insert_matches_for_project(?)`,
      [projectId],
    );

    if (queryResult) {
      const emailText = `Matches were updated successfully\n You can check the new updates in the dashboard`;

      const mailData: ISendMailOptions = {
        from: '"No Reply" <no-reply@localhost>',
        to: project.user.contact_email,
        subject: 'Project matches were rebuilt',
        text: emailText,
        template: 'match-created',
        context: {
          name: project.user.username,
          message: emailText,
        },
      };
      await this.mailService.sendMail(mailData);
    }
    return { message: 'Matches rebuilt successfully' };
  }

  async refreshMatches(): Promise<{ message: string }> {
    const projects = await this.projectRepo.find({
      where: {
        status: ProjectStatus.ACTIVE,
      },
    });

    for (const project of projects) {
      await this.rebuildProjectMatches(project.id);
    }

    return { message: 'All active project matches refreshed successfully' };
  }
}
