import BadRequestError from '@errors/BusinessRuleViolationError';

export class InvalidAgeError extends BadRequestError {
  constructor(message?: string) {
    super(message ?? 'The age restriction is invalid');
    this.name = 'InvalidAgeError';
  }
}
