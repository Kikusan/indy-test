import BadRequestError from '@errors/BadRequestError';

export class InvalidRestrictionTypeError extends BadRequestError {
  constructor(message?: string) {
    super(message ?? 'Unknown restriction type');
    this.name = 'InvalidRestrictionTypeError';
  }
}
