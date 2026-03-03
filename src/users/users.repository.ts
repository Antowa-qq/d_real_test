import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { PaymentHistory } from './entities/payment-history.entity';
import { User } from './entities/user.entity';
import { PaymentAction } from './enums/payment-history.enum';
import { IInsertPaymentHistoryParams } from './interfaces/payment-history.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByIdForUpdate(userId: string, manager: EntityManager): Promise<User | null> {
    const result = await manager
      .createQueryBuilder(User, 'user')
      .setLock('pessimistic_write')
      .where('user.id = :id', { id: userId })
      .getOne();

    return result || null;
  }

  async insertPaymentHistory(
    { userId, action, amount }: IInsertPaymentHistoryParams,
    manager: EntityManager,
  ): Promise<PaymentHistory> {
    const record = manager.create(PaymentHistory, { userId, action, amount });
    return manager.save(PaymentHistory, record);
  }

  async recalculateBalance(userId: string, manager: EntityManager): Promise<number> {
    const result = await manager
      .createQueryBuilder(PaymentHistory, 'ph')
      .select(
        `COALESCE(SUM(CASE WHEN ph.action = '${PaymentAction.CREDIT}' THEN ph.amount ELSE 0 END), 0)
         - COALESCE(SUM(CASE WHEN ph.action = '${PaymentAction.DEBIT}' THEN ph.amount ELSE 0 END), 0)`,
        'balance',
      )
      .where('ph.user_id = :userId', { userId })
      .getRawOne<{ balance: number }>();

    return result?.balance ?? 0;
  }

  async updateBalance(userId: string, balance: number, manager: EntityManager): Promise<void> {
    await manager.update(User, { id: userId }, { balance });
  }
}
