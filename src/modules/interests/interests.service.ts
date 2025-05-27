import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }

  async findByIds(ids: string[]): Promise<Interest[]> {
    const interests = await this.interestsRepository.findByIds(ids);
    if (interests.length !== ids.length) {
      throw new NotFoundException('Un ou plusieurs intérêts n\'ont pas été trouvés');
    }
    return interests;
  }

  async findUserInterests(userId: string): Promise<Interest[]> {
    return this.interestsRepository
      .createQueryBuilder('interest')
      .innerJoin('interest.users', 'user', 'user.id = :userId', { userId })
      .getMany();
  }

  async recommendProjects(userId: string): Promise<Project[]> {
    // Récupérer les intérêts de l'utilisateur
    const userInterests = await this.findUserInterests(userId);
    const interestIds = userInterests.map(interest => interest.id);

    if (interestIds.length === 0) {
      return [];
    }

    // Trouver les projets qui correspondent aux intérêts de l'utilisateur
    return this.projectsRepository
      .createQueryBuilder('project')
      .innerJoin('project.categories', 'interest', 'interest.id IN (:...interestIds)', { interestIds })
      .leftJoinAndSelect('project.owner', 'owner')
      .orderBy('project.createdAt', 'DESC')
      .getMany();
  }
} 