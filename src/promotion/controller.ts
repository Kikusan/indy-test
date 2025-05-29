import { Controller, Get } from '@nestjs/common';
import { PromotionService } from './service';
import { ApiTags } from '@nestjs/swagger';

@Controller('promotion')
@ApiTags('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get()
  getHello(): string {
    return this.promotionService.getHello();
  }
}
