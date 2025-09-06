import { JWTAuthGuard } from '@app/auth/guards/jwt.guard';
import { Roles } from '@app/auth/guards/roles.decorator';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { RequestWithUser } from '@app/auth/interfaces/request-with-user.interface';
import { UserRole } from '@database/mysql/entities';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsServiceAbstract } from './abstracts/projects.service.abstract';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';

@ApiTags('Projects')
@Controller('/projects')
@UseGuards(JWTAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(
    @Inject(ProjectsServiceAbstract)
    private readonly projectsService: ProjectsServiceAbstract,
  ) {}

  @Get('/')
  @Roles(UserRole.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'User projects retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getMyProjects(@Req() req: RequestWithUser) {
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found.');
    }

    const userId = req.user.id;

    try {
      return this.projectsService.findProjectsByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/:id/matches')
  @Roles(UserRole.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'Project matches retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async getProjectMatches(
    @Req() req: RequestWithUser,
    @Param('id') projectId: string,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found.');
    }

    const userId = req.user.id;

    try {
      return this.projectsService.getProjectMatchesById(userId, projectId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/:id/matches/rebuild')
  @Roles(UserRole.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'Project matches rebuilt successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  rebuildProjectMatches(
    @Req() req: RequestWithUser,
    @Param('id') projectId: string,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found.');
    }

    try {
      return this.projectsService.rebuildProjectMatches(projectId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/new')
  @Roles(UserRole.CLIENT)
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createProject(
    @Req() req: RequestWithUser,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found.');
    }

    try {
      return await this.projectsService.createProject(
        createProjectDto,
        req.user,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put('/:id')
  @Roles(UserRole.CLIENT)
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async updateProject(
    @Req() req: RequestWithUser,
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found.');
    }

    const userId = req.user.id;
    try {
      return this.projectsService.updateProject(
        userId,
        projectId,
        updateProjectDto,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('/:id')
  @Roles(UserRole.CLIENT)
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async deleteProject(
    @Req() req: RequestWithUser,
    @Param('id') projectId: string,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found.');
    }

    const userId = req.user.id;

    try {
      return this.projectsService.deleteProject(userId, projectId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
