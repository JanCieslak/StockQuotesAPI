import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('money')
  amount: number;

  @ManyToOne(
    type => CompanyEntity,
    company => company.transactions,
  )
  company: CompanyEntity;
}
