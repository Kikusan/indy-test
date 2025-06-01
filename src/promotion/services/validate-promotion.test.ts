import NotFoundError from '@errors/NotFoundError';
import { Promotion } from '../domain/promotion.entity';
import { PromotionProps } from '../domain/types/promotion.props';
import { InMemoryPromotionRepository } from '../repositories/promotion/InMemoryPromotionRepository';
import { InMemoryWeatherRepository } from '../repositories/weather/InMemoryWeatherRepository';
import { ValidatePromotionService } from './validate-promotion';

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
    try {
      await validatePromotionService.execute(payload);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundError);
      return;
    }
    expect(false).toBeTruthy();
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
    try {
      await validatePromotionService.execute(payload);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundError);
      return;
    }
    expect(false).toBeTruthy();
  });
});
