import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { PaymentAction } from './enums/payment-history.enum';
import { InsufficientBalanceException } from './exceptions/insufficient-balance.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { IDebitParams, IDebitResult } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async debit(params: IDebitParams): Promise<IDebitResult> {
    const { amount, userId } = params;

    this.logger.log(`debit userId=${userId}, amount=${amount}`);

    const result = await this.dataSource.transaction(async (manager) => {
      const user = await this.usersRepository.findByIdForUpdate(userId, manager);
      console.log(user);
      if (!user) throw new UserNotFoundException({ context: { userId } });

      if (user.balance < amount) throw new InsufficientBalanceException();

      await this.usersRepository.insertPaymentHistory(
        { userId, action: PaymentAction.DEBIT, amount: amount },
        manager,
      );

      const newBalance = await this.usersRepository.recalculateBalance(userId, manager);

      await this.usersRepository.updateBalance(userId, newBalance, manager);

      return { userId, balance: newBalance };
    });

    this.logger.log(`debit Debited ${amount} from user ${userId}. New balance: ${result.balance}`);

    return result;
  }
}
