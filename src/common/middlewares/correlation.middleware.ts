import { IncomingMessage, ServerResponse } from 'http';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: IncomingMessage, res: ServerResponse, next: () => void): void {
    const requestId = (req.headers['x-correlation-id'] as string) ?? uuidv7();
    this.cls.set('requestId', requestId);
    res.setHeader('x-correlation-id', requestId);
    next();
  }
}
