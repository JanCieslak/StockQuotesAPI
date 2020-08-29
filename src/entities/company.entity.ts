import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity('company')
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  symbol: string;

  @OneToMany(
    type => TransactionEntity,
    transaction => transaction.company,
  )
  transactions: TransactionEntity[];
}
