import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Investment } from '../../investments/entities/investment.entity';
import { Interest } from '../../interests/entities/interest.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column()
  category: string;

  @ManyToOne(() => User, user => user.projects)
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => Investment, investment => investment.project)
  investments: Investment[];

  @ManyToMany(() => Interest, interest => interest.projects)
  @JoinTable()
  interests: Interest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 