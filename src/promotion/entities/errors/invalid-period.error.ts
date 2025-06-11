import BadRequestError from '@errors/BusinessRuleViolationError';

export class InvalidPeriodError extends BadRequestError {
  constructor(message?: string) {
    super(message ?? 'Period is invalid');
    this.name = 'InvalidPeriodError';
  }
}
