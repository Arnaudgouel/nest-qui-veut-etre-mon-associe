import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Interest } from '../interests/entities/interest.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    if (user.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
    }
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Vérifie si l'utilisateur existe
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }
    
    return user;
  }

  async getEntrepreneurs(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.ENTREPRENEUR },
    });
  }

  async getInvestors(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.INVESTOR },
    });
  }

  async addInterests(userId: string, interestIds: string[]): Promise<User> {
    // Cette méthode sera implémentée avec la relation ManyToMany
    // Nous récupérons l'utilisateur avec ses intérêts
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Cette partie devra être complétée quand nous aurons le service des intérêts
    return user;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto, interestIds?: string[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Update user info
    Object.assign(user, updateUserDto);

    // Update interests if provided
    if (interestIds && interestIds.length > 0) {
      user.interests = interestIds.map(id => ({ id }) as Interest);
    }

    return this.usersRepository.save(user);
  }
}
