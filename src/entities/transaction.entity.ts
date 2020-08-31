import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('money')
  amount: number;

  @ManyToOne(
    type => CompanyEntity,
    company => company.transactions,
    { onDelete: 'CASCADE' },
  )
  company: CompanyEntity;
}
