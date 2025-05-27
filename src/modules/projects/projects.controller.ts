import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { InterestsService } from '../interests/interests.service';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly interestsService: InterestsService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ENTREPRENEUR)
  create(@Body() createProjectDto: CreateProjectDto, @Request() req: RequestWithUser) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('recommended')
  async getRecommendedProjects(@Request() req: RequestWithUser) {
    return this.interestsService.recommendProjects(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.projectsService.remove(id, req.user.id, req.user.role);
  }
} 