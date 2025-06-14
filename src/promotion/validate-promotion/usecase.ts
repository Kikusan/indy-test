import NotFoundError from '@errors/RessourceNotFoundError';
import { ValidationProps } from './types/validation.props';
import { IPromotionRepository } from '../repositories/promotion/IPromotionRepository';
import { IWeatherRepository } from '../repositories/weather/IWeatherRepository';
import { ValidationResult } from './dto/validation-result';

export class ValidatePromotionService {
  constructor(
    private readonly promotionRepository: IPromotionRepository,
    private readonly weatherRepository: IWeatherRepository,
  ) {}

  async execute(validationProps: ValidationProps): Promise<ValidationResult> {
    const promotion = await this.promotionRepository.getbyName(
      validationProps.name,
    );

    if (!promotion) {
      throw new NotFoundError(
        `the promocode ${validationProps.name} does not exist`,
      );
    }

    const weather = await this.weatherRepository.get(
      validationProps.arguments.town,
    );

    return promotion.validate({
      age: validationProps.arguments.age,
      date: new Date(),
      weather,
    });
  }
}
