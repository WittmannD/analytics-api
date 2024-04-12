import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({
    description: 'GA session unique identifier.',
  })
  session_id: string;

  @ApiProperty({
    description: 'GA client unique identifier.',
  })
  client_id: string;
}
