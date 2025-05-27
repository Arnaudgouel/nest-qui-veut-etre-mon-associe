import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, userRole: string): Promise<Project> {
    const project = await this.findOne(id);
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce projet');
    }

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const project = await this.findOne(id);
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer ce projet');
    }

    const result = await this.projectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }
  }
} 