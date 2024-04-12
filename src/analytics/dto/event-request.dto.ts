import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  clientIdPropertyDescriptionDoc,
  userIdPropertyDescriptionDoc,
} from '../../docs/documents';
import { Type } from 'class-transformer';
import { Type as ClassType } from '@nestjs/common';

export class EventRequestDto<T> {
  @ApiProperty({
    description: clientIdPropertyDescriptionDoc,
    example: '1234567.987654321',
    maxLength: 256,
  })
  @IsString()
  @Length(1, 256)
  client_id: string;

  @ApiPropertyOptional({
    description: userIdPropertyDescriptionDoc,
    example: '1234567',
    maxLength: 256,
  })
  @IsOptional()
  @IsString()
  @Length(1, 256)
  user_id?: string;

  @IsDefined()
  event: T;
}

export function EventRequestDtoFactory<T>(eventType: ClassType<T>) {
  class ConcreteEventRequestDto extends EventRequestDto<T> {
    @IsDefined()
    @ValidateNested()
    @Type(() => eventType)
    event: T;
  }

  return ConcreteEventRequestDto;
}
