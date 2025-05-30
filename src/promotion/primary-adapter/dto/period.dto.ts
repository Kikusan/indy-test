import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class PeriodDto {
  @ApiProperty({ example: '2025-06-01' })
  @IsDate()
  @Type(() => Date)
  beginDate: Date;

  @ApiProperty({ example: '2025-06-30' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
