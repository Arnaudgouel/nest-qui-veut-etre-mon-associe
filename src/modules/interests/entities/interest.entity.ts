import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, user => user.interests)
  users: User[];

  @ManyToMany(() => Project, project => project.interests)
  projects: Project[];
} 