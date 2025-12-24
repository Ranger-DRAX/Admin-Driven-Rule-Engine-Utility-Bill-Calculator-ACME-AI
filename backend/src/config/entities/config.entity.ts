import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Admin } from '../../auth/entities/admin.entity';

@Entity('configs')
export class Config {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rate_name' })
  rateName: string;

  @Column({ name: 'rate_type' })
  rateType: 'base_rate' | 'tax' | 'surcharge' | 'tier_rate';

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'rate_value' })
  rateValue: number;

  @Column({ name: 'unit_type', nullable: true })
  unitType: 'per_kwh' | 'percentage' | 'fixed';

  @Column({ name: 'consumer_type', nullable: true })
  consumerType: 'residential' | 'commercial' | 'industrial' | 'all';

  @Column({ name: 'tier_min_units', default: 0 })
  tierMinUnits: number;

  @Column({ name: 'tier_max_units', nullable: true })
  tierMaxUnits: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'vat_percentage', default: 0 })
  vatPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'fixed_service_charge', default: 0 })
  fixedServiceCharge: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'effective_from', type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: Date;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: Admin;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
