import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { EventRequestDto } from '../../analytics/dto/event-request.dto';

export const ApiEventRequestBody = <EventDto extends Type<unknown>>(
  eventDto: EventDto,
) =>
  applyDecorators(
    ApiExtraModels(EventRequestDto, eventDto),
    ApiBody({
      schema: {
        allOf: [
          { $ref: getSchemaPath(EventRequestDto) },
          {
            properties: {
              event: {
                $ref: getSchemaPath(eventDto),
              },
            },
          },
        ],
      },
    }),
  );
