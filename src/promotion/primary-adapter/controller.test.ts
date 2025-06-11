import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PromotionController } from './controller';
import { CreatePromotionService } from '../create-promotion/usecase';
import { InMemoryPromotionRepository } from '../repositories/promotion/InMemoryPromotionRepository';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';
import { ValidatePromotionService } from '../validate-promotion/usecase';
import { InMemoryWeatherRepository } from '../repositories/weather/InMemoryWeatherRepository';
import { PromotionProps } from '../entities/types/promotion.props';
import { Promotion } from '../entities/promotion.entity';

describe('PromotionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
            return new InMemoryPromotionRepository([promotion]);
          },
        },
        {
          provide: 'weatherRepository',
          useFactory: () => {
            return new InMemoryWeatherRepository();
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new ErrorInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('/ POST', () => {
    it('should create a promotion', async () => {
      const payload = {
        name: 'Summer Sale',
        advantage: {
          percent: 20,
        },
        restrictions: [
          {
            date: {
              after: '2019-01-01',
              before: '2020-06-30',
            },
          },
          {
            or: [
              {
                age: {
                  eq: 40,
                },
              },
              {
                and: [
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
        ],
      };
      const response = await request(app.getHttpServer())
        .post('/promotions')
        .send(payload)
        .expect(201);

      expect(response.body).toEqual({ message: 'Promotion saved' });
    });

    it('should fail with an error 400 when an invalid input is given', async () => {
      const invalidPayload = {
        advantage: { percent: 15 },
      };

      const response = await request(app.getHttpServer())
        .post('/promotions')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.message).toContain('name must be a string');
    });

    it('should fail with an error 400 when the input does not respect domain rules', async () => {
      const invalidPayload = {
        name: 'Summerfz Sale',
        advantage: {
          percent: 20,
        },
        restrictions: [
          {
            date: {
              after: '2019-01-01',
              before: '2020-06-30',
            },
          },
          {
            age: {
              eq: 40,
              gt: 90,
            },
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/promotions')
        .send(invalidPayload)
        .expect(400);
    });

    it('should fail with an error 400 when the first restriction is not the date restriction', async () => {
      const invalidPayload = {
        name: 'Summerfz Sale',
        advantage: {
          percent: 20,
        },
        restrictions: [
          {
            age: {
              eq: 40,
              gt: 90,
            },
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/promotions')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.message).toContain(
        'the first restriction must be the period restriction',
      );
    });

    it('should fail with an error 400 when the second restriction is defined but empty', async () => {
      const invalidPayload = {
        name: 'Summerfz Sale',
        advantage: {
          percent: 20,
        },
        restrictions: [
          {
            date: {
              after: '2021-01-01',
              before: '2022-01-01',
            },
          },
          {},
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/promotions')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.message).toContain(
        'the restriction rules if defined must be have at least one restriction',
      );
    });
  });

  describe('/validate POST', () => {
    it('should returns status code 200', async () => {
      const payload = {
        name: 'promo in the list',
        arguments: {
          age: 25,
          town: 'Paris',
        },
      };
      await request(app.getHttpServer())
        .post('/promotions/validate')
        .send(payload)
        .expect(200);
    });

    it('should returns status code 404 if promo code is unknown', async () => {
      const invalidPayload = {
        name: 'unknown code',
        arguments: {
          age: 25,
          town: 'Paris',
        },
      };
      await request(app.getHttpServer())
        .post('/promotions/validate')
        .send(invalidPayload)
        .expect(404);
    });

    it('should returns status code 404 if town is unknown', async () => {
      const invalidPayload = {
        name: 'promo in the list',
        arguments: {
          age: 25,
          town: 'no where city',
        },
      };
      await request(app.getHttpServer())
        .post('/promotions/validate')
        .send(invalidPayload)
        .expect(404);
    });

    it('should fail with an error 400 when an invalid input is given', async () => {
      const invalidPayload = {
        arguments: {
          age: 25,
          town: 'Paris',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/promotions/validate')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.message).toContain('name must be a string');
    });
  });
});
