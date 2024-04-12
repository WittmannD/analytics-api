import { ApiResponse } from '@nestjs/swagger';
import { EventResponseDto } from '../../analytics/dto/event-response.dto';
import { HttpStatus } from '@nestjs/common';

export const ApiEventResponse = (status?: HttpStatus, description?: string) =>
  ApiResponse({
    status: status || HttpStatus.CREATED,
    description: description || 'Event was successfully sent.',
    type: EventResponseDto,
  });
