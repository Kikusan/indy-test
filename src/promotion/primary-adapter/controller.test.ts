import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PromotionController } from './controller';
import { CreatePromotionService } from '../services/create-promotion';
import { InMemoryPromotionRepository } from '../repositories/InMemoryPromotionRepository';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';

describe('PromotionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
          provide: 'promotionRepository',
          useFactory: () => {
            return new InMemoryPromotionRepository();
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
  describe('POST', () => {
    it('/ (POST) should create a promotion', async () => {
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

    it('/ (POST) should fail with an error 400 when an invalid input is given', async () => {
      const invalidPayload = {
        advantage: { percent: 15 },
      };

      const response = await request(app.getHttpServer())
        .post('/promotions')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.message).toContain('name must be a string');
    });

    it('/ (POST) should fail with an error 400 when the input does not respect domain rules', async () => {
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

    it('/ (POST) should fail with an error 400 when the first restriction is not the date restriction', async () => {
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

    it('/ (POST) should fail with an error 400 when the second restriction is defined but empty', async () => {
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
});
