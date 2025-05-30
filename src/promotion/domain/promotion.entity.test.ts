import {
  InvalidAdvantageError,
  InvalidPeriodError,
  InvalidAgeError,
  InvalidWeatherError,
} from './errors';
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
      restrictions: {
        age: { lt: 65, gt: 18 },
      },
    };

    const promotion = new Promotion(promotionProps);

    const expectedPromotion = {
      name: 'basic',
      advantage: { percent: 30 },
      dateRestriction: {
        after: new Date('2019-01-01'),
        before: new Date('2026-01-01'),
      },
      restrictionTree: {
        age: { lt: 65, gt: 18 },
      },
    };

    expect(promotion).toEqual(expectedPromotion);
  });

  it('should create a complex promotion', () => {
    const promotionProps: PromotionProps = {
      name: 'DeepPromo',
      reductionPercent: 25,
      period: {
        beginDate: new Date('2021-01-01'),
        endDate: new Date('2024-12-31'),
      },
      restrictions: {
        or: [
          {
            age: { eq: 50 },
          },
          {
            and: [
              {
                age: { gt: 18, lt: 35 },
              },
              {
                or: [
                  {
                    weather: {
                      is: 'Rain',
                      temp: { lt: 10 },
                    },
                  },
                  {
                    and: [
                      {
                        age: { gt: 60 },
                      },
                      {
                        weather: {
                          is: 'Clear',
                          temp: { gt: 20 },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const promotion = new Promotion(promotionProps);

    const expectedPromotion = {
      name: 'DeepPromo',
      advantage: { percent: 25 },
      dateRestriction: {
        after: new Date('2021-01-01'),
        before: new Date('2024-12-31'),
      },
      restrictionTree: {
        or: [
          {
            age: { eq: 50 },
          },
          {
            and: [
              {
                age: { gt: 18, lt: 35 },
              },
              {
                or: [
                  {
                    weather: {
                      is: 'Rain',
                      temp: { lt: 10 },
                    },
                  },
                  {
                    and: [
                      {
                        age: { gt: 60 },
                      },
                      {
                        weather: {
                          is: 'Clear',
                          temp: { gt: 20 },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
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

  it('should throw an invalid age restriction error if gt is lower than lt', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: 90,
      period: {
        beginDate: new Date('2006-01-01'),
        endDate: new Date('2019-01-01'),
      },
      restrictions: { age: { lt: 18, gt: 65 } },
    };
    try {
      new Promotion(promotionProps);
    } catch (e) {
      expect(e).toEqual(
        new InvalidAgeError(
          'Invalid age restriction: gt must be lower than lt',
        ),
      );
      return;
    }
    expect(false).toBeTruthy();
  });

  it('should throw an invalid age restriction error if eq is combined with other attribute', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: 90,
      period: {
        beginDate: new Date('2006-01-01'),
        endDate: new Date('2019-01-01'),
      },
      restrictions: { age: { eq: 18, lt: 65 } },
    };
    try {
      new Promotion(promotionProps);
    } catch (e) {
      expect(e).toEqual(
        new InvalidAgeError(
          'Invalid age restriction: cannot combine eq with lt or gt',
        ),
      );
      return;
    }
    expect(false).toBeTruthy();
  });

  it('should throw an invalid weather error if the type of weather is unknown', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: 90,
      period: {
        beginDate: new Date('2006-01-01'),
        endDate: new Date('2019-01-01'),
      },
      restrictions: {
        and: [
          { age: { eq: 18 } },
          {
            weather: {
              is: 'Chaos',
            },
          },
        ],
      },
    };
    try {
      new Promotion(promotionProps);
    } catch (e) {
      expect(e).toEqual(new InvalidWeatherError('Invalid weather: Chaos'));
      return;
    }
    expect(false).toBeTruthy();
  });

  it('should throw an invalid weather error if gt is lower than lt', () => {
    const promotionProps: PromotionProps = {
      name: 'basic',
      reductionPercent: 90,
      period: {
        beginDate: new Date('2006-01-01'),
        endDate: new Date('2019-01-01'),
      },
      restrictions: {
        and: [
          { age: { eq: 18 } },
          {
            weather: {
              temp: {
                lt: 10,
                gt: 30,
              },
            },
          },
        ],
      },
    };
    try {
      new Promotion(promotionProps);
    } catch (e) {
      expect(e).toEqual(
        new InvalidWeatherError(
          'Invalid weather restriction: gt must be lower than lt',
        ),
      );
      return;
    }
    expect(false).toBeTruthy();
  });
});
