import BadRequestError from '@errors/BusinessRuleViolationError';

export class InvalidRestrictionTypeError extends BadRequestError {
  constructor(message?: string) {
    super(message ?? 'Unknown restriction type');
    this.name = 'InvalidRestrictionTypeError';
  }
}
