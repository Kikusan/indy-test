import BadRequestError from '@errors/BadRequestError';

export class InvalidAdvantageError extends BadRequestError {
  constructor() {
    super();
    this.name = 'InvalidAdvantageError';
  }
}
