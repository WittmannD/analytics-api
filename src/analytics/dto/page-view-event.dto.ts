import { EventCommonDto } from './event-common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { requiredPageTitlePropertyDescriptionDoc } from '../../docs/documents';
import { EventRequestDtoFactory } from './event-request.dto';

export class PageViewEventDto extends EventCommonDto {
  @ApiProperty({
    description: requiredPageTitlePropertyDescriptionDoc,
  })
  @IsString()
  page_title: string;
}

export const PageViewEventRequest = EventRequestDtoFactory(PageViewEventDto);
