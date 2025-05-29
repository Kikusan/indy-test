import BadRequestError from '@errors/BadRequestError';

export class InvalidPeriodError extends BadRequestError {
  constructor() {
    super('The begin date must be lower than the end date');
    this.name = 'InvalidPeriodError';
  }
}
