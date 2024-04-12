import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GAMeasurementId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request>().query?.['ga_measurement_id'],
);
