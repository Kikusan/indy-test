import NotFoundError from '@errors/RessourceNotFoundError';
import { Promotion } from '../entities/promotion.entity';
import { PromotionProps } from '../entities/types/promotion.props';
import { InMemoryPromotionRepository } from '../repositories/promotion/InMemoryPromotionRepository';
import { InMemoryWeatherRepository } from '../repositories/weather/InMemoryWeatherRepository';
import { ValidatePromotionService } from './usecase';

describe('createPromotionService', () => {
  it('should be ok', async () => {
    const promotionProps: PromotionProps = {
      name: 'promo in the list',
      reductionPercent: 30,
      period: {
        beginDate: new Date('2019-01-01'),
        endDate: new Date('2026-01-01'),
      },
      restrictions: {
        age: { lt: 65, gt: 18 },
      },
    };
    const promotion = new Promotion(promotionProps);
    const promotionRepository = new InMemoryPromotionRepository([promotion]);
    const wheatherRepository = new InMemoryWeatherRepository();
    const validatePromotionService = new ValidatePromotionService(
      promotionRepository,
      wheatherRepository,
    );
    const payload = {
      name: 'promo in the list',
      arguments: {
        age: 25,
        town: 'Paris',
      },
    };
    const result = await validatePromotionService.execute(payload);

    expect(result).toBeDefined();
  });

  it('should return a not found error when promo code is unknown', async () => {
    const promotionRepository = new InMemoryPromotionRepository();
    const wheatherRepository = new InMemoryWeatherRepository();
    const validatePromotionService = new ValidatePromotionService(
      promotionRepository,
      wheatherRepository,
    );
    const payload = {
      name: 'promo in the list',
      arguments: {
        age: 25,
        town: 'Paris',
      },
    };
    await expect(validatePromotionService.execute(payload)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should return a not found error when city is unknown', async () => {
    const promotionProps: PromotionProps = {
      name: 'promo in the list',
      reductionPercent: 30,
      period: {
        beginDate: new Date('2019-01-01'),
        endDate: new Date('2026-01-01'),
      },
      restrictions: {
        age: { lt: 65, gt: 18 },
      },
    };
    const promotion = new Promotion(promotionProps);
    const promotionRepository = new InMemoryPromotionRepository([promotion]);
    const wheatherRepository = new InMemoryWeatherRepository();
    const validatePromotionService = new ValidatePromotionService(
      promotionRepository,
      wheatherRepository,
    );
    const payload = {
      name: 'promo in the list',
      arguments: {
        age: 25,
        town: 'No where city',
      },
    };

    await expect(validatePromotionService.execute(payload)).rejects.toThrow(
      NotFoundError,
    );
  });
});
