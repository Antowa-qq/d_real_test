import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPaymentHistory } from '../interfaces/payment-history.interface';
import { User } from './user.entity';
import { PaymentAction } from '../enums/payment-history.enum';

@Entity('payment_history')
@Index('idx_payment_history_user_id_ts', ['userId', 'ts'])
@Check(`"amount" > 0`)
export class PaymentHistory implements IPaymentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: PaymentAction })
  action: PaymentAction;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  ts: Date;

  @ManyToOne(() => User, (user) => user.paymentHistory)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
