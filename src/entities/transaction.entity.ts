import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('money')
  amount: number;

  @ManyToOne(
    type => Company,
    company => company.transactions,
  )
  company: Company;
}
