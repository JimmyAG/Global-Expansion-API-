import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { Match } from './match.entity';
import { User } from './user.entity';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('projects')
@Index(['country', 'status'])
export class Project extends AuditableEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column('json', { array: false, default: null, nullable: true })
  services_needed: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true })
  budget: number;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @OneToMany(() => Match, (match) => match.project)
  matches: Match[];
}
