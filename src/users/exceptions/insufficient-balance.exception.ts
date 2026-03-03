import { BaseException, IConstructorException } from '../../common/error/base';
import { ExceptionGroup } from '../../common/error/interface';

export class InsufficientBalanceException extends BaseException {
  static readonly CODE = 'INSUFFICIENT_BALANCE';
  static readonly GROUP = ExceptionGroup.BAD_REQUEST;
  static readonly DEFAULT_MESSAGE = 'Insufficient balance';

  constructor({ message, cause, context }: IConstructorException = {}) {
    super({
      cause,
      context,
      code: InsufficientBalanceException.CODE,
      group: InsufficientBalanceException.GROUP,
      message: message || InsufficientBalanceException.DEFAULT_MESSAGE,
    });
  }
}
