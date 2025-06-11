import BadRequestError from '@errors/BusinessRuleViolationError';

export class InvalidAdvantageError extends BadRequestError {
  constructor() {
    super('the reduction percentage must be between 0 and 100');
    this.name = 'InvalidAdvantageError';
  }
}
