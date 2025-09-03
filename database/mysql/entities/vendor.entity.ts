import { Entity, Column, OneToMany } from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { Match } from './match.entity';

@Entity('vendors')
export class Vendor extends AuditableEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column('json', { array: false, default: null, nullable: true })
  countries_supported: string[];

  @Column('json', { array: false, default: null, nullable: true })
  services_offered: string[];

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0.0,
    unsigned: true,
  })
  rating: number;

  @Column({ type: 'int', unsigned: true })
  response_sla_hours: number;

  @OneToMany(() => Match, (match) => match.vendor)
  matches: Match[];
}
