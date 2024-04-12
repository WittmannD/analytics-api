import { EventCommonDto } from './event-common.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
  mediumPropertyDescriptionDoc,
  sourcePropertyDescriptionDoc,
} from '../../docs/documents';

export class CampaignDetailsEventDto extends EventCommonDto {
  @ApiPropertyOptional({
    description: 'Optional. The campaign id.',
    example: 'google_1234',
  })
  @IsOptional()
  @IsString()
  campaign_id?: string;

  @ApiPropertyOptional({
    description:
      'Optional. The name used to identify a specific promotion or strategic campaign.',
    example: 'Summer_fun',
  })
  @IsOptional()
  @IsString()
  campaign?: string;

  @ApiPropertyOptional({
    description: sourcePropertyDescriptionDoc,
    example: 'google',
    default: 'Direct',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: mediumPropertyDescriptionDoc,
    example: 'cpc',
    default: '(none)',
  })
  @IsOptional()
  @IsString()
  medium?: string;

  @ApiPropertyOptional({
    description:
      'Optional. The campaign term used with paid search to supply the keywords for ads.',
    example: 'summer+travel',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description:
      'Optional. The campaign content used for A/B testing and content-' +
      'targeted ads to differentiate ads or links that point to the same URL.',
    example: 'logolink',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
