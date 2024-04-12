import { Type, ValidationPipe } from '@nestjs/common';
import { EventRequestDtoFactory } from '../../analytics/dto/event-request.dto';
import { EventCommonDto } from '../../analytics/dto/event-common.dto';

export const EventRequestValidationPipe = <T extends EventCommonDto>(
  eventDto: Type<T>,
) =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    expectedType: EventRequestDtoFactory(eventDto),
  });
