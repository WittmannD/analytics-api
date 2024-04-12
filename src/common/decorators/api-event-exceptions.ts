import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PostEventError } from '../../analytics/dto/event-error.dto';

const EventErrorSchema = (statusCode: HttpStatus) => ({
  allOf: [
    { $ref: getSchemaPath(PostEventError) },
    {
      properties: {
        statusCode: {
          type: 'number',
          const: statusCode,
        },
      },
    },
  ],
});

const ApiError = (statusCode: HttpStatus, description: string) =>
  ApiResponse({
    status: statusCode,
    description,
    schema: EventErrorSchema(statusCode),
  });

export const ApiEventExceptions = () =>
  applyDecorators(
    ApiExtraModels(PostEventError),
    ApiError(
      HttpStatus.FORBIDDEN,
      'X-GA-API-SECRET header is missing or contains an invalid GA API Secret.',
    ),
    ApiError(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'Event parameters failed validation.',
    ),
  );
