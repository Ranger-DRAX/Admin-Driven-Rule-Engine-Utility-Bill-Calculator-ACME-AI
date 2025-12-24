import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('calculation_history')
export class CalculationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'consumer_name', nullable: true })
  consumerName: string;

  @Column({ name: 'consumer_id', nullable: true })
  consumerId: string;

  @Column({ name: 'consumer_type' })
  consumerType: 'residential' | 'commercial' | 'industrial';

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'units_consumed' })
  unitsConsumed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_amount' })
  baseAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'tax_amount' })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'surcharge_amount' })
  surchargeAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ name: 'calculation_month', type: 'varchar', length: 7 })
  calculationMonth: string;

  @Column({ type: 'text', name: 'rate_breakdown' })
  rateBreakdown: string;

  @Column({ type: 'text', name: 'applied_rates' })
  appliedRates: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
