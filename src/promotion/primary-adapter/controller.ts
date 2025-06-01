import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  PeriodProps,
  PromotionProps,
  RestrictionNodeProps,
} from '../domain/types/promotion.props';
import { CreatePromotionService } from '../services/create-promotion';
import { ValidatePromotionDto } from './dto/validate-promotion/validate-promotion.dto';
import { ValidatePromotionService } from '../services/validate-promotion';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionController {
  constructor(
    private readonly createPromotionService: CreatePromotionService,
    private readonly validatePromotionService: ValidatePromotionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new promotion',
    description:
      'Creates a promotion with optional restrictions and a defined advantage, the first restriction must be the date restriction and is mandatory',
  })
  @ApiCreatedResponse({ description: 'Promotion successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    const promotionProps: PromotionProps =
      CreatePromotionDtoToPromotionPropsMapper(createPromotionDto);
    await this.createPromotionService.execute(promotionProps);
    return { message: 'Promotion saved' };
  }

  @Post('/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate a promotion',
    description:
      'Validate a promotion with its name and user location and name',
  })
  @ApiOkResponse({ description: 'Promotion successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async validate(@Body() validatePromotionDto: ValidatePromotionDto) {
    await this.validatePromotionService.execute(validatePromotionDto);
    return { message: 'Promotion validated', validatePromotionDto };
  }
}

const CreatePromotionDtoToPromotionPropsMapper = (
  dto: CreatePromotionDto,
): PromotionProps => {
  const { name, advantage, restrictions } = dto;
  let customRestrictions;
  const period = mapPeriod(restrictions[0]);
  if (restrictions[1]) {
    customRestrictions = hasAtLeastOneProperty(restrictions[1]);
  }

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

  return {
    beginDate: restriction.date.after,
    endDate: restriction.date.before,
  };
};

function hasAtLeastOneProperty(restriction): RestrictionNodeProps {
  const properties = ['and', 'or', 'age', 'weather', 'date'];
  const isRestriction = properties.some(
    (prop) => restriction[prop] !== undefined && restriction[prop] !== null,
  );

  if (isRestriction) {
    return restriction;
  } else {
    throw new BadRequestException(
      'the restriction rules if defined must be have at least one restriction',
    );
  }
}
