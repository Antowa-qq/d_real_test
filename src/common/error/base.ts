import { ExceptionGroup } from './interface';

export interface IBaseConstructorError {
  message: string;
  code: string;
  traceId: string | undefined;
  details: Record<string, any>;
}

export interface IBaseConstructorException {
  code: string;
  message?: string;
  group: ExceptionGroup;
  context?: unknown;
  cause?: unknown;
}

export interface IConstructorException {
  message?: string;
  context?: unknown;
  cause?: unknown;
}

export class BaseError {
  message: string;
  code: string;
  traceId: string | undefined;
  details: Record<string, any>;

  constructor({ message, code, traceId, details }: IBaseConstructorError) {
    this.message = message;
    this.code = code;
    this.traceId = traceId;
    this.details = details;
  }
}

export class BaseException extends Error {
  public readonly code: string;
  public readonly group: ExceptionGroup;
  public readonly context?: unknown;
  constructor({ message, code, context, cause, group }: IBaseConstructorException) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.cause = cause;
    this.group = group;
  }
}
