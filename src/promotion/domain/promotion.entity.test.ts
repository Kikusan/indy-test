import { InvalidAdvantageError, InvalidPeriodError } from './errors';
import { Promotion } from './promotion.entity';
import { PromotionProps } from './promotion.props';

describe('Promotion entity', () => {
  it('should create a promotion', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: 30,
      period: {
        beginDate: new Date('2019-01-01'),
        endDate: new Date('2026-01-01'),
      },
    };
    const promotion = new Promotion(promotionProps);
    const expectedPromotion = {
      name: 'basic',
      advantage: { percent: 30 },
      restrictions: [
        {
          date: {
            after: new Date('2019-01-01'),
            before: new Date('2026-01-01'),
          },
        },
      ],
    };
    expect(promotion).toEqual(expectedPromotion);
  });

  it('should throw an invalid advantage error if the advantage is below 0', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: -90,
      period: {
        beginDate: new Date('2019-01-01'),
        endDate: new Date('2026-01-01'),
      },
    };
    try {
      new Promotion(promotionProps);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidAdvantageError);
      return;
    }
    expect(false).toBeTruthy();
  });

  it('should throw an invalid advantage error if the advantage is above 100', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: 9000,
      period: {
        beginDate: new Date('2019-01-01'),
        endDate: new Date('2026-01-01'),
      },
    };
    try {
      new Promotion(promotionProps);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidAdvantageError);
      return;
    }
    expect(false).toBeTruthy();
  });

  it('should throw an invalid period error if the begin date is higher than the end date', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: 90,
      period: {
        beginDate: new Date('2026-01-01'),
        endDate: new Date('2019-01-01'),
      },
    };
    try {
      new Promotion(promotionProps);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidPeriodError);
      return;
    }
    expect(false).toBeTruthy();
  });
});
