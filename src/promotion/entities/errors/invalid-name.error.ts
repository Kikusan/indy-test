import BadRequestError from '@errors/BusinessRuleViolationError';

export class InvalidNameError extends BadRequestError {
  constructor(name: string) {
    super(`A promo code with the name ${name} already exists`);
    this.name = 'InvalidNameError';
  }
}
