import { InvalidNameError } from '../entities/errors/invalid-name.error';
import { Promotion } from '../entities/promotion.entity';
import { PromotionProps } from '../entities/types/promotion.props';
import { InMemoryPromotionRepository } from '../repositories/promotion/InMemoryPromotionRepository';
import { CreatePromotionService } from './usecase';

describe('createPromotionService', () => {
  it('should save a promotion', async () => {
    const promotionRepository = new InMemoryPromotionRepository();
    const createPromotionService = new CreatePromotionService(
      promotionRepository,
    );
    const promotionToBeCreated = {
      name: 'promo test',
      restrictions: {
        or: [
          { age: { eq: 40 } },
          {
            and: [
              { age: { lt: 30, gt: 15 } },
              { weather: { is: 'Clear', temp: { gt: 15 } } },
            ],
          },
        ],
      },
      period: {
        beginDate: new Date('2019-01-01T00:00:00.000Z'),
        endDate: new Date('2020-06-30T00:00:00.000Z'),
      },
      reductionPercent: 20,
    };
    await createPromotionService.execute(promotionToBeCreated);
    const newlyCreatedPromo = await promotionRepository.getbyName('promo test');
    const expectedPromotion = {
      name: 'promo test',
      advantage: {
        percent: 20,
      },
      dateRestriction: {
        after: new Date('2019-01-01T00:00:00.000Z'),
        before: new Date('2020-06-30T00:00:00.000Z'),
      },
      restrictionTree: {
        restrictions: [
          {
            age: {
              eq: 40,
            },
          },
          {
            restrictions: [
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
    };
    expect(newlyCreatedPromo).toMatchObject(expectedPromotion);
  });

  it('should throws an invalid name if promo code with the same name exists', async () => {
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
    const createPromotionService = new CreatePromotionService(
      promotionRepository,
    );
    const promotionToBeCreated = {
      name: 'promo in the list',
      period: {
        beginDate: new Date('2019-01-01T00:00:00.000Z'),
        endDate: new Date('2020-06-30T00:00:00.000Z'),
      },
      reductionPercent: 20,
    };
    await expect(
      createPromotionService.execute(promotionToBeCreated),
    ).rejects.toThrow(InvalidNameError);
  });
});
