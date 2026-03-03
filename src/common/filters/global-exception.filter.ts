import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ClsService } from 'nestjs-cls';

import { BaseException } from '../error/base';
import { ClassValidatorException } from '../error/exceptions';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../error/errors';
import { InternalServerException, ValidationException } from '../error/exceptions';
import { ExceptionGroup } from '../error/interface';

export const classValidatorErrorFormat = (
  errors: ValidationError[] | undefined,
): Record<string, string[]> => {
  if (!errors) return {};

  const formatted: Record<string, string[]> = {};

  for (const error of errors) {
    if (error.constraints) {
      formatted[error.property] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      const childErrors = classValidatorErrorFormat(error.children);
      for (const [key, messages] of Object.entries(childErrors)) {
        formatted[`${error.property}.${key}`] = messages;
      }
    }
  }

  return formatted;
};

const mappedExceptionToHttpError = {
  [ExceptionGroup.BAD_REQUEST]: BadRequestError,
  [ExceptionGroup.UNAUTHORIZED]: UnauthorizedError,
  [ExceptionGroup.FORBIDDEN]: ForbiddenError,
  [ExceptionGroup.NOT_FOUND]: NotFoundError,
  [ExceptionGroup.SERVER_ERROR]: InternalServerError,
};

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly cls: ClsService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const errorInstance = this.handler(exception);

    this.logger.error(errorInstance.message);

    void response.code(errorInstance.statusCode).send(errorInstance);
  }

  private handler(exception: unknown) {
    const traceId = this.cls.get<string>('requestId');

    console.log(exception);

    if (exception instanceof BaseException) {
      const ErrorClass = mappedExceptionToHttpError[exception.group];

      return new ErrorClass({
        message: exception.message,
        code: exception.code,
        traceId,
        details: {},
      });
    }

    if (exception instanceof ClassValidatorException) {
      const formattedDetails = classValidatorErrorFormat(exception.errors);

      return new BadRequestError({
        message: ValidationException.DEFAULT_MESSAGE,
        code: ValidationException.CODE,
        traceId,
        details: formattedDetails,
      });
    }

    return new InternalServerError({
      message: InternalServerException.DEFAULT_MESSAGE,
      code: InternalServerException.CODE,
      traceId,
      details: {},
    });
  }
}
