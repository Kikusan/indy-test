import { InvalidNameError } from '../entities/errors/invalid-name.error';
import { Promotion } from '../entities/promotion.entity';
import { PromotionProps } from '../entities/types/promotion.props';
import { IPromotionRepository } from '../repositories/promotion/IPromotionRepository';

export class CreatePromotionService {
  constructor(private readonly promotionRepository: IPromotionRepository) {}

  async execute(promotionProps: PromotionProps): Promise<void> {
    const promotionName = promotionProps.name;
    const promotionWithSameName =
      await this.promotionRepository.getbyName(promotionName);
    if (promotionWithSameName) {
      throw new InvalidNameError(promotionName);
    }
    const promotion = new Promotion(promotionProps);
    await this.promotionRepository.save(promotion);
  }
}
