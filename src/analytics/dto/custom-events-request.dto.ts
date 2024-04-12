import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { clientIdPropertyDescriptionDoc, userIdPropertyDescriptionDoc } from '../../docs/documents';

export class CustomEventsRequestDto {
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

  @ApiProperty({
    type: [Object],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsObject({ each: true })
  events: Array<Record<string, any>>;
}
