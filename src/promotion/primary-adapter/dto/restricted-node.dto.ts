import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AgeDto } from './age.dto';
import { WeatherDto } from './weather.dto';
import { PeriodDto } from './period.dto';

export class RestrictionNodeDto {
  @ApiProperty({
    type: [RestrictionNodeDto],
    required: false,
    example: { weather: { is: 'Clear' } },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestrictionNodeDto)
  and?: RestrictionNodeDto[];

  @ApiProperty({
    type: [RestrictionNodeDto],
    required: false,
    example: { age: { eq: 18 } },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestrictionNodeDto)
  or?: RestrictionNodeDto[];

  @ApiProperty({ type: AgeDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AgeDto)
  age?: AgeDto;

  @ApiProperty({ type: WeatherDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeatherDto)
  weather?: WeatherDto;

  @ApiProperty({ type: PeriodDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PeriodDto)
  period?: PeriodDto;
}
