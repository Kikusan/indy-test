import { Promotion } from '../../domain/promotion.entity';

export interface IPromotionRepository {
  save(newPromotion: Promotion): Promise<void>;
  getbyName(name: string): Promise<Promotion | null>;
}
