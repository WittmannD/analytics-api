import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { EventCommonDto } from './event-common.dto';

export class DepositEventDto extends EventCommonDto {
  @ApiProperty({
    description: 'Currency in which the deposit was made.',
    default: 'USDT',
  })
  @IsString()
  cryptocurrency: string;

  @ApiProperty({
    description: 'Deposit amount',
    example: 250.5,
  })
  @IsPositive()
  value: number;

  @ApiPropertyOptional({
    description: 'Optional. Balance replenishment method.',
    examples: ['Direct transfer', 'https://app.utpay.io/'],
  })
  @IsString()
  method?: string;

  @ApiPropertyOptional({
    description: 'Optional. Transaction ID.',
  })
  @IsOptional()
  @IsString()
  transaction_id?: string;
}
