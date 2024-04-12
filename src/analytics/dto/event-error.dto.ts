import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class PostEventError {
  @ApiProperty({
    type: [String],
  })
  messages: string[];

  @ApiProperty()
  error: string;

  statusCode: HttpStatus;
}
