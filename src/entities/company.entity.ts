import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  symbol: string;

  @OneToMany(
    type => Transaction,
    transaction => transaction.company,
  )
  transactions: Transaction[];
}
