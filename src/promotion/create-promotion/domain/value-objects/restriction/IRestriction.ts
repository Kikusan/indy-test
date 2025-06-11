import { ValidationContextProps } from '../../types/validation-context.props';

export interface IRestriction {
  validate(context: ValidationContextProps): string[];
}
