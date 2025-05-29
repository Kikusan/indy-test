import BadRequestError from '@errors/BadRequestError';

export class InvalidWeatherError extends BadRequestError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidWeatherError';
  }
}
