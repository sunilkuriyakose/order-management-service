import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class DateFilterDto {
  @ApiPropertyOptional({
    description: 'From date',
    example: '2023-08-09T11:40:26.852Z',
  })
  @IsISO8601()
  @IsOptional()
  from: string;

  @ApiPropertyOptional({
    description: 'To date',
    example: '2023-08-09T13:40:26.852Z',
  })
  @IsISO8601()
  @IsOptional()
  to: string;
}
