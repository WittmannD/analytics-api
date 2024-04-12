import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  engagementsTimePropertyDescriptionDoc,
  languagePropertyDescriptionOdc,
  pageReferrerPropertyDescriptionDoc,
  pageTitlePropertyDescriptionDoc,
} from '../../docs/documents';

export class EventCommonDto {
  @ApiPropertyOptional({
    description: engagementsTimePropertyDescriptionDoc,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  engagement_time_msec?: number = 100;

  @ApiPropertyOptional({
    description: pageTitlePropertyDescriptionDoc,
  })
  @IsOptional()
  @IsString()
  page_title?: string;

  @ApiPropertyOptional({
    description: pageReferrerPropertyDescriptionDoc,
    example: 'https://www.google.com/',
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'] })
  page_referrer?: string;

  @ApiPropertyOptional({
    description: languagePropertyDescriptionOdc,
    example: 'uk-UA',
  })
  @IsOptional()
  @IsString()
  language?: string;

  constructor(data: Partial<EventCommonDto>) {
    Object.assign(this, data);
  }
}
