import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { IUser } from '../interfaces/user.interface';

import { PaymentHistory } from './payment-history.entity';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  balance: number;

  @OneToMany(() => PaymentHistory, (ph) => ph.user)
  paymentHistory: PaymentHistory[];
}
