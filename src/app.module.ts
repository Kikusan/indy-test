import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { PromotionModule } from './promotion/module';

@Module({
  imports: [PromotionModule],
  controllers: [HealthCheckController],
})
export class AppModule {}
