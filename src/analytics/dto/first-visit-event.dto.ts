import { EventCommonDto } from './event-common.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';
import { pageReferrerPropertyDescriptionDoc } from '../../docs/documents';
import { CampaignDetailsEventDto } from './campaign-details-event.dto';
import { IntersectionType } from '@nestjs/swagger';

export class FirstVisitEventDto extends IntersectionType(
  EventCommonDto,
  CampaignDetailsEventDto,
) {
  @ApiPropertyOptional({
    description: pageReferrerPropertyDescriptionDoc,
    example: 'https://www.google.com/',
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'] })
  page_referrer?: string;
}
