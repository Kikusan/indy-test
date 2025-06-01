import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  ValidateNested,
  IsString,
} from 'class-validator';

class WeatherTempDto {
  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsNumber()
  gt?: number;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  lt?: number;
}

export class WeatherDto {
  @ApiProperty({ example: 'Clouds', required: false })
  @IsOptional()
  @IsString()
  is?: string;

  @ApiProperty({ type: WeatherTempDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeatherTempDto)
  temp?: WeatherTempDto;
}
