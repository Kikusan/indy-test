import { Module } from '@nestjs/common';
import { PromotionController } from './primary-adapter/controller';
import { CreatePromotionService } from './services/create-promotion';
import { InMemoryPromotionRepository } from './repositories/InMemoryPromotionRepository';

@Module({
  imports: [],
  controllers: [PromotionController],
  providers: [
    {
      provide: CreatePromotionService,
      useFactory: (promotionRepository) => {
        return new CreatePromotionService(promotionRepository);
      },
      inject: ['promotionRepository'],
    },
    {
      provide: 'promotionRepository',
      useFactory: () => {
        return new InMemoryPromotionRepository();
      },
    },
  ],
})
export class PromotionModule {}
