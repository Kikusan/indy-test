import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckController } from './health-check.controller';
import { PromotionModule } from './promotion/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PromotionModule,
  ],
  controllers: [HealthCheckController],
})
export class AppModule {}
