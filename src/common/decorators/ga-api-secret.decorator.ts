import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GAApiSecret = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request>().header('X-GA-API-SECRET'),
);
