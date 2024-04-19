import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  clientIdPropertyDescriptionDoc,
  userIdPropertyDescriptionDoc,
} from '../../docs/documents';
import { Type } from 'class-transformer';

export class CustomEventDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsObject()
  @IsDefined()
  params: Record<string, any>;
}

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
    type: [CustomEventDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CustomEventDto)
  events: CustomEventDto[];
}
