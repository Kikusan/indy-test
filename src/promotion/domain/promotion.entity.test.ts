import {
  InvalidAdvantageError,
  InvalidPeriodError,
  InvalidAgeError,
  InvalidWeatherError,
  InvalidRestrictionTypeError,
} from './errors';
import { Promotion } from './promotion.entity';
import { PromotionProps } from './types/promotion.props';
import { ValidationContextProps } from './types/validation-context.props';
import { ValidationResult } from './value-objects/validation-result';

describe('Promotion entity', () => {
  describe('constructor', () => {
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

      expect(promotion).toMatchObject(expectedPromotion);
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
        advantage: {
          percent: 25,
        },
        dateRestriction: {
          after: new Date('2021-01-01T00:00:00.000Z'),
          before: new Date('2024-12-31T00:00:00.000Z'),
        },
        restrictionTree: {
          restrictions: [
            {
              age: {
                eq: 50,
              },
            },
            {
              restrictions: [
                {
                  age: {
                    lt: 35,
                    gt: 18,
                  },
                },
                {
                  restrictions: [
                    {
                      weather: {
                        is: 'Rain',
                        temp: {
                          lt: 10,
                        },
                      },
                    },
                    {
                      restrictions: [
                        {
                          age: {
                            gt: 60,
                          },
                        },
                        {
                          weather: {
                            is: 'Clear',
                            temp: {
                              gt: 20,
                            },
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
      expect(promotion).toMatchObject(expectedPromotion);
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

    it('should throw an invalid period error if the begin date or the end date is null or invalid', () => {
      const promotionProps: PromotionProps = {
        name: 'basic',
        reductionPercent: 90,
        period: {
          beginDate: new Date('fail'),
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

    it('should throw an invalid restriction type error if an invalid attribute is found in restrictions', () => {
      const promotionProps: PromotionProps = {
        name: 'basic',
        reductionPercent: 90,
        period: {
          beginDate: new Date('2006-01-01'),
          endDate: new Date('2019-01-01'),
        },
        restrictions: {
          and: [
            { failure: { eq: 18 } },
            {
              weather: {
                temp: {
                  lt: 30,
                  gt: 10,
                },
              },
            },
          ],
        },
      } as PromotionProps;
      try {
        new Promotion(promotionProps);
      } catch (e) {
        expect(e).toEqual(
          new InvalidRestrictionTypeError('Unknown restriction type'),
        );
        return;
      }
      expect(false).toBeTruthy();
    });
  });

  describe('validate', () => {
    it('should be accepted for a simple one', () => {
      const promotionProps: PromotionProps = {
        name: 'basic',
        reductionPercent: 50,
        period: {
          beginDate: new Date('2019-01-01'),
          endDate: new Date('2026-01-01'),
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 30,
        date: new Date('2022-01-01'),
        weather: {
          condition: 'Clear',
          maxTemp: 30,
          minTemp: 20,
        },
      };

      const validationResult = promotion.validate(validationContext);
      const expectedValidationResult: ValidationResult = {
        name: 'basic',
        status: 'accepted',
        advantage: { percent: 50 },
      };

      expect(validationResult).toEqual(expectedValidationResult);
    });
    it('should be denied when the date is not included in the validity period', () => {
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
      const validationContext: ValidationContextProps = {
        age: 30,
        date: new Date('2010-01-01'),
        weather: {
          condition: 'Clear',
          maxTemp: 30,
          minTemp: 20,
        },
      };

      const validationResult = promotion.validate(validationContext);
      const expectedValidationResult: ValidationResult = {
        name: 'basic',
        status: 'denied',
        reasons: ['DATE_NOT_ELIGIBLE'],
      };

      expect(validationResult).toEqual(expectedValidationResult);
    });

    it('should be denied when the age restriction is not fulfilled (range)', () => {
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
      const validationContext: ValidationContextProps = {
        age: 9,
        date: new Date('2020-01-01'),
        weather: {
          condition: 'Clear',
          maxTemp: 30,
          minTemp: 20,
        },
      };

      const validationResult = promotion.validate(validationContext);
      const expectedValidationResult: ValidationResult = {
        name: 'basic',
        status: 'denied',
        reasons: ['AGE_NOT_ELIGIBLE'],
      };

      expect(validationResult).toEqual(expectedValidationResult);
    });
    it('should be denied when the age restriction is not fulfilled (equality)', () => {
      const promotionProps: PromotionProps = {
        name: 'basic',
        reductionPercent: 30,
        period: {
          beginDate: new Date('2019-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          age: { eq: 30 },
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 9,
        date: new Date('2020-01-01'),
        weather: {
          condition: 'Clear',
          maxTemp: 30,
          minTemp: 20,
        },
      };

      const validationResult = promotion.validate(validationContext);
      const expectedValidationResult: ValidationResult = {
        name: 'basic',
        status: 'denied',
        reasons: ['AGE_NOT_ELIGIBLE'],
      };

      expect(validationResult).toEqual(expectedValidationResult);
    });
    it('should be denied when the weather condition restriction is not fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'basic',
        reductionPercent: 30,
        period: {
          beginDate: new Date('2019-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          weather: {
            is: 'Clear',
          },
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 9,
        date: new Date('2020-01-01'),
        weather: {
          condition: 'Rain',
          maxTemp: 30,
          minTemp: 20,
        },
      };

      const validationResult = promotion.validate(validationContext);
      const expectedValidationResult: ValidationResult = {
        name: 'basic',
        status: 'denied',
        reasons: ['WEATHER_NOT_ELIGIBLE'],
      };

      expect(validationResult).toEqual(expectedValidationResult);
    });
    it('should be denied when the weather temperature restriction is not fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'basic',
        reductionPercent: 30,
        period: {
          beginDate: new Date('2019-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          weather: {
            temp: {
              lt: 20,
              gt: 15,
            },
          },
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 9,
        date: new Date('2020-01-01'),
        weather: {
          condition: 'Rain',
          maxTemp: 5,
          minTemp: 0,
        },
      };

      const validationResult = promotion.validate(validationContext);
      const expectedValidationResult: ValidationResult = {
        name: 'basic',
        status: 'denied',
        reasons: ['WEATHER_NOT_ELIGIBLE'],
      };

      expect(validationResult).toEqual(expectedValidationResult);
    });
    it('should be denied when one of the AND restrictions is not fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'combo-restriction',
        reductionPercent: 20,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          and: [{ age: { gt: 18 } }, { weather: { temp: { lt: 30, gt: 15 } } }],
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 20,
        date: new Date('2023-05-01'),
        weather: {
          condition: 'Clear',
          maxTemp: 10,
          minTemp: 5, // temp restriction non respectée
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'combo-restriction',
        status: 'denied',
        reasons: ['WEATHER_NOT_ELIGIBLE'],
      });
    });

    it('should be accepted when all AND restrictions are fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'full-match',
        reductionPercent: 25,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          and: [
            { age: { gt: 18, lt: 65 } },
            { weather: { temp: { gt: 10, lt: 25 } } },
          ],
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 30,
        date: new Date('2024-05-01'),
        weather: {
          condition: 'Clouds',
          maxTemp: 20,
          minTemp: 15,
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'full-match',
        status: 'accepted',
        advantage: { percent: 25 },
      });
    });

    it('should be denied when one of the AND restrictions is not fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'combo-restriction',
        reductionPercent: 20,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          and: [{ age: { gt: 18 } }, { weather: { temp: { lt: 30, gt: 15 } } }],
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 20,
        date: new Date('2023-05-01'),
        weather: {
          condition: 'Clear',
          maxTemp: 10,
          minTemp: 5,
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'combo-restriction',
        status: 'denied',
        reasons: ['WEATHER_NOT_ELIGIBLE'],
      });
    });

    it('should be accepted when all AND restrictions are fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'full-match',
        reductionPercent: 25,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          and: [
            { age: { gt: 18, lt: 65 } },
            { weather: { temp: { gt: 10, lt: 25 } } },
          ],
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 30,
        date: new Date('2024-05-01'),
        weather: {
          condition: 'Clouds',
          maxTemp: 20,
          minTemp: 15,
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'full-match',
        status: 'accepted',
        advantage: { percent: 25 },
      });
    });

    it('should be accepted when one of the OR restrictions is fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'flexible-restriction',
        reductionPercent: 10,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          or: [{ age: { lt: 18 } }, { weather: { is: 'Rain' } }],
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 25,
        date: new Date('2023-11-10'),
        weather: {
          condition: 'Rain', // OK
          maxTemp: 12,
          minTemp: 10,
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'flexible-restriction',
        status: 'accepted',
        advantage: { percent: 10 },
      });
    });

    it('should be denied when none of the OR restrictions are fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'strict-flexibility',
        reductionPercent: 15,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          or: [{ age: { lt: 18 } }, { weather: { is: 'Snow' } }],
        },
      };

      const promotion = new Promotion(promotionProps);
      const validationContext: ValidationContextProps = {
        age: 30,
        date: new Date('2023-11-10'),
        weather: {
          condition: 'Clear',
          maxTemp: 12,
          minTemp: 10,
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'strict-flexibility',
        status: 'denied',
        reasons: ['AGE_NOT_ELIGIBLE', 'WEATHER_NOT_ELIGIBLE'],
      });
    });
    it('should be accepted when deeply nested and/or conditions are fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'ultra-instinct',
        reductionPercent: 90,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          and: [
            {
              or: [
                {
                  and: [{ age: { gt: 20 } }, { weather: { is: 'Clear' } }],
                },
                {
                  and: [
                    { age: { eq: 18 } },
                    {
                      or: [
                        { weather: { temp: { gt: 15, lt: 35 } } },
                        { weather: { is: 'Clouds' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              or: [{ age: { lt: 40 } }, { weather: { temp: { lt: 10 } } }],
            },
          ],
        },
      };

      const promotion = new Promotion(promotionProps);

      const validationContext: ValidationContextProps = {
        age: 18,
        date: new Date('2025-06-01'),
        weather: {
          condition: 'Clouds',
          minTemp: 16,
          maxTemp: 28,
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'ultra-instinct',
        status: 'accepted',
        advantage: { percent: 90 },
      });
    });
    it('should be denied when no valid path in deep nested structure is fulfilled', () => {
      const promotionProps: PromotionProps = {
        name: 'ultra-instinct',
        reductionPercent: 90,
        period: {
          beginDate: new Date('2020-01-01'),
          endDate: new Date('2026-01-01'),
        },
        restrictions: {
          and: [
            {
              or: [
                {
                  and: [{ age: { gt: 20 } }, { weather: { is: 'Clear' } }],
                },
                {
                  and: [
                    { age: { eq: 18 } },
                    {
                      or: [
                        { weather: { temp: { gt: 15, lt: 35 } } },
                        { weather: { is: 'Clouds' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              or: [{ age: { lt: 40 } }, { weather: { temp: { lt: 10 } } }],
            },
          ],
        },
      };

      const promotion = new Promotion(promotionProps);

      const validationContext: ValidationContextProps = {
        age: 50,
        date: new Date('2025-06-01'),
        weather: {
          condition: 'Rain',
          minTemp: 5,
          maxTemp: 12,
        },
      };

      const validationResult = promotion.validate(validationContext);

      expect(validationResult).toEqual({
        name: 'ultra-instinct',
        status: 'denied',
        reasons: ['WEATHER_NOT_ELIGIBLE', 'AGE_NOT_ELIGIBLE'],
      });
    });
  });
});
