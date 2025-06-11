import BadRequestError from '@errors/BusinessRuleViolationError';

export class InvalidWeatherError extends BadRequestError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidWeatherError';
  }
}
