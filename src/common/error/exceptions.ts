import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BaseException, IConstructorException } from './base';
import { ExceptionGroup } from './interface';

export class InternalServerException extends BaseException {
  static readonly DEFAULT_MESSAGE = 'Internal server error';
  static readonly CODE = 'INTERNAL_SERVER_ERROR';
  static readonly GROUP = ExceptionGroup.SERVER_ERROR;

  constructor({ message, cause, context }: IConstructorException = {}) {
    super({
      cause,
      context,
      code: InternalServerException.CODE,
      group: InternalServerException.GROUP,
      message: message || InternalServerException.DEFAULT_MESSAGE,
    });
  }
}

export class ValidationException extends BaseException {
  static readonly DEFAULT_MESSAGE = 'Validation error';
  static readonly CODE = 'VALIDATION_ERROR';
  static readonly GROUP = ExceptionGroup.BAD_REQUEST;

  constructor({ message, cause, context }: IConstructorException = {}) {
    super({
      cause,
      context,
      code: ValidationException.CODE,
      group: ValidationException.GROUP,
      message: message || ValidationException.DEFAULT_MESSAGE,
    });
  }
}

export class ClassValidatorException extends BadRequestException {
  constructor(public readonly errors: ValidationError[]) {
    super(errors);
  }
}
