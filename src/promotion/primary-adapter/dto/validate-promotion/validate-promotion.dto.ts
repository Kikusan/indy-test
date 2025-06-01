import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class ArgumentDto {
  @ApiProperty({ example: 25 })
  @IsNumber()
  age: number;
  @ApiProperty({ example: 'Paris' })
  @IsString()
  town: string;
}

export class ValidatePromotionDto {
  @ApiProperty({ example: 'Summer Sale' })
  @IsString()
  name: string;

  @ApiProperty({ example: { age: 25, town: 'Paris' } })
  @ValidateNested({ each: true })
  @Type(() => ArgumentDto)
  arguments: ArgumentDto;
}
