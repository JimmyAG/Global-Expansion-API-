import { Entity, Column, OneToMany } from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { Project } from './project.entity';

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends AuditableEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'varchar', length: 255 })
  company_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  contact_email: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
