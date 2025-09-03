import {
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export abstract class AuditableEntity extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at!: Date;

  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
  })
  deleted_at?: Date;

  constructor(data: Partial<AuditableEntity> = {}) {
    super(data);
    Object.assign(this, data);
  }
}
