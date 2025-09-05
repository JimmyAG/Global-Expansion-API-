import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { Project } from './project.entity';
import { Vendor } from './vendor.entity';

@Entity('matches')
@Unique('uq_project_vendor', ['projectId', 'vendorId'])
export class Match extends AuditableEntity {
  @Column({ type: 'uuid', name: 'project_id' })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'uuid', name: 'vendor_id' })
  vendorId: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;
}
