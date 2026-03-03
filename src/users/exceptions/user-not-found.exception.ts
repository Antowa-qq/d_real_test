import { BaseException, IConstructorException } from '../../common/error/base';
import { ExceptionGroup } from '../../common/error/interface';

export class UserNotFoundException extends BaseException {
  static readonly CODE = 'USER_NOT_FOUND_EXCEPTION';
  static readonly GROUP = ExceptionGroup.NOT_FOUND;
  static readonly DEFAULT_MESSAGE = 'User not found';

  constructor({ message, cause, context }: IConstructorException = {}) {
    super({
      cause,
      context,
      code: UserNotFoundException.CODE,
      group: UserNotFoundException.GROUP,
      message: message || UserNotFoundException.DEFAULT_MESSAGE,
    });
  }
}
