import { Injectable } from '@nestjs/common';

@Injectable()
export class PromotionService {
  getHello(): string {
    return 'Hello promotion!';
  }
}
