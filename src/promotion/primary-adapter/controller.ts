import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { PeriodProps, PromotionProps } from '../domain/promotion.props';
import { CreatePromotionService } from '../services/create-promotion';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionController {
  constructor(
    private readonly createPromotionService: CreatePromotionService,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Promotion successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async create(@Body() dto: CreatePromotionDto) {
    const promotionProps: PromotionProps =
      CreatePromotionDtoToPromotionPropsMapper(dto);
    await this.createPromotionService.execute(promotionProps);
    return { message: 'Promotion saved' };
  }
}

const CreatePromotionDtoToPromotionPropsMapper = (
  dto: CreatePromotionDto,
): PromotionProps => {
  const { name, advantage, restrictions } = dto;
  const period = mapPeriod(restrictions[0]);
  const customRestrictions = restrictions[1];
  return {
    name,
    restrictions: customRestrictions,
    period,
    reductionPercent: advantage.percent,
  };
};

const mapPeriod = (restriction): PeriodProps => {
  if (!restriction.date) {
    throw new BadRequestException(
      'the first restriction must be the period restriction',
    );
  }

  const before = new Date(restriction.date.before);
  const after = new Date(restriction.date.after);

  return {
    beginDate: after,
    endDate: before,
  };
};
