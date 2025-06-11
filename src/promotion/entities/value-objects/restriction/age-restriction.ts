import { ValidationContextProps } from '../../types/validation-context.props';
import { Age } from '../age';
import { IRestriction } from './IRestriction';

export class AgeRestriction implements IRestriction {
  constructor(private readonly age: Age) {}

  validate(context: ValidationContextProps): string[] {
    if (!this.age.validate(context.age)) {
      return ['AGE_NOT_ELIGIBLE'];
    }
    return [];
  }
}
