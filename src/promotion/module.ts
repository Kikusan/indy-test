import { Module } from '@nestjs/common';
import { PromotionController } from './controller';
import { PromotionService } from './service';

@Module({
  imports: [],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
