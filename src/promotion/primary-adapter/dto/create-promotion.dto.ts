import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RestrictionNodeDto } from './restricted-node.dto';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Summer Sale' })
  @IsString()
  name: string;

  @ApiProperty({ example: { percent: 20 } })
  @IsObject()
  advantage: { percent: number };

  @ApiProperty({
    type: RestrictionNodeDto,
    required: false,
    isArray: true,
    example: [
      {
        date: {
          after: '2019-01-01',
          before: '2020-06-30',
        },
      },
      {
        or: [
          {
            age: {
              eq: 40,
            },
          },
          {
            and: [
              {
                age: {
                  lt: 30,
                  gt: 15,
                },
              },
              {
                weather: {
                  is: 'Clear',
                  temp: {
                    gt: 15,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestrictionNodeDto)
  restrictions?: RestrictionNodeDto[];
}
