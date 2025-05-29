import BadRequestError from '@errors/BadRequestError';

export class InvalidAgeError extends BadRequestError {
  constructor(message?: string) {
    super(message ?? 'The age restriction is invalid');
    this.name = 'InvalidAgeError';
  }
}
