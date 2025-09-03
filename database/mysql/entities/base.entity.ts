import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity as TypeORMBaseEntity,
} from 'typeorm';

@Entity()
export abstract class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  constructor(data: Partial<BaseEntity> = {}) {
    super();
    Object.assign(this, data);
  }
}
