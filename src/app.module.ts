import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromotionModule } from './promotion/module';

@Module({
  imports: [PromotionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
