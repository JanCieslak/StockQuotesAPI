import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity()
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

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
