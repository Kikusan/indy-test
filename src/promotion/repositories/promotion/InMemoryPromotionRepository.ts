import { Promotion } from '../../domain/promotion.entity';
import { IPromotionRepository } from '../promotion/IPromotionRepository';

export class InMemoryPromotionRepository implements IPromotionRepository {
  private readonly promotions: Promotion[] = [];

  constructor(promotions: Promotion[] = []) {
    this.promotions = promotions;
  }

  save(newPromotion: Promotion) {
    this.promotions.push(newPromotion);
    return Promise.resolve();
  }

  getbyName(name: string): Promise<Promotion | null> {
    const found = this.promotions.find((promo) => promo.getName() === name);
    return Promise.resolve(found ?? null);
  }
}
