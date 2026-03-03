import { BaseError, IBaseConstructorError } from './base';

export class BadRequestError extends BaseError {
  statusCode = 400;

  constructor(params: IBaseConstructorError) {
    super(params);
  }
}

export class ConflictError extends BaseError {
  statusCode = 409;

  constructor(params: IBaseConstructorError) {
    super(params);
  }
}

export class ForbiddenError extends BaseError {
  statusCode = 403;

  constructor(params: IBaseConstructorError) {
    super(params);
  }
}

export class InternalServerError extends BaseError {
  statusCode = 500;

  constructor(params: IBaseConstructorError) {
    super(params);
  }
}

export class NotFoundError extends BaseError {
  statusCode = 404;

  constructor(params: IBaseConstructorError) {
    super(params);
  }
}

export class UnauthorizedError extends BaseError {
  statusCode = 401;

  constructor(params: IBaseConstructorError) {
    super(params);
  }
}
