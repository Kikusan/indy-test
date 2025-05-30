import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RestrictionNodeDto } from './restricted-node.dto';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Summer Sale' })
  @IsString()
  name: string;

  @ApiProperty({ example: { percent: 20 } })
  advantage: { percent: number };

  @ApiProperty({ type: RestrictionNodeDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => RestrictionNodeDto)
  restrictions?: RestrictionNodeDto;
}
