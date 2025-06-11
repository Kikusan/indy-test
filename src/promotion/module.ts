import { Module } from '@nestjs/common';
import { PromotionController } from './primary-adapter/controller';
import { CreatePromotionService } from './create-promotion/usecase';
import { InMemoryPromotionRepository } from './repositories/promotion/InMemoryPromotionRepository';
import { ValidatePromotionService } from './validate-promotion/usecase';
import { ApiWeatherRepository } from './repositories/weather/ApiWeatherRepository';
import { ConfigService } from '@nestjs/config';

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
      provide: ValidatePromotionService,
      useFactory: (promotionRepository, weatherRepository) => {
        return new ValidatePromotionService(
          promotionRepository,
          weatherRepository,
        );
      },
      inject: ['promotionRepository', 'weatherRepository'],
    },
    {
      provide: 'promotionRepository',
      useFactory: () => {
        return new InMemoryPromotionRepository();
      },
    },
    {
      provide: 'weatherRepository',
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('OPENWEATHER_API_KEY');
        if (!apiKey) {
          throw new Error('OPENWEATHER_API_KEY is not defined in .env');
        }
        return new ApiWeatherRepository(apiKey);
      },
      inject: [ConfigService],
    },
  ],
})
export class PromotionModule {}
