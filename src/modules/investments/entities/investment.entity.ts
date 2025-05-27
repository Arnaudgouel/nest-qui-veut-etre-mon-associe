import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.investments)
  investor: User;

  @Column()
  investorId: string;

  @ManyToOne(() => Project, project => project.investments)
  project: Project;

  @Column()
  projectId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  date: Date;
} 