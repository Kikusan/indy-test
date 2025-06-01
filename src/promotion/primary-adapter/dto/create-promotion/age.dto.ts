import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class AgeDto {
  @ApiProperty({ example: 18, required: false })
  @IsOptional()
  @IsNumber()
  gt?: number;

  @ApiProperty({ example: 65, required: false })
  @IsOptional()
  @IsNumber()
  lt?: number;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  eq?: number;
}
