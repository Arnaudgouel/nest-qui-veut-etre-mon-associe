import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, investorId: string): Promise<Investment> {
    const investment = this.investmentsRepository.create({
      ...createInvestmentDto,
      investorId,
    });
    return this.investmentsRepository.save(investment);
  }

  async findAllByInvestor(investorId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { investorId },
      relations: ['project', 'investor'],
    });
  }

  async findAllByProject(projectId: string, userId: string, userRole: string): Promise<Investment[]> {
    const investments = await this.investmentsRepository.find({
      where: { projectId },
      relations: ['project', 'investor'],
    });

    if (investments.length > 0) {
      const project = investments[0].project;
      if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à voir les investissements de ce projet');
      }
    }

    return investments;
  }

  async remove(id: string, investorId: string): Promise<void> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['investor'],
    });

    if (!investment) {
      throw new NotFoundException(`Investissement avec l'ID ${id} non trouvé`);
    }

    if (investment.investorId !== investorId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cet investissement');
    }

    await this.investmentsRepository.delete(id);
  }
} 