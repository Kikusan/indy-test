import { ValidationContextProps } from '../../types/validation-context.props';
import { IRestriction } from './IRestriction';

export class AndRestriction implements IRestriction {
  constructor(private readonly restrictions: IRestriction[]) {}

  validate(context: ValidationContextProps): string[] {
    const deniedReasons = new Set<string>();
    this.restrictions.forEach((r) => {
      r.validate(context).forEach((reason) => deniedReasons.add(reason));
    });
    return [...deniedReasons];
  }
}
