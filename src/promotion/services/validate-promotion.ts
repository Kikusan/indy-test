import NotFoundError from '@errors/NotFoundError';
import { ValidationProps } from '../domain/types/validation.props';
import { IPromotionRepository } from '../repositories/promotion/IPromotionRepository';
import { IWeatherRepository } from '../repositories/weather/IWeatherRepository';

export class ValidatePromotionService {
  constructor(
    private readonly promotionRepository: IPromotionRepository,
    private readonly weatherRepository: IWeatherRepository,
  ) {}
  async execute(validationProps: ValidationProps): Promise<any> {
    const promotionName = validationProps.name;
    const promotion = await this.promotionRepository.getbyName(promotionName);
    if (!promotion) {
      throw new NotFoundError(`the promocode ${promotionName} does not exist`);
    }
    const weather = await this.weatherRepository.get(
      validationProps.arguments.town,
    );

    return Promise.resolve(weather);
  }
}
