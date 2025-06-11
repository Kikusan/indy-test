import { ValidationContextProps } from '../../types/validation-context.props';
import { IRestriction } from './IRestriction';

export class OrRestriction implements IRestriction {
  constructor(private readonly restrictions: IRestriction[]) {}

  validate(context: ValidationContextProps): string[] {
    const reasonsList = this.restrictions.map((r) => r.validate(context));
    if (reasonsList.some((reasons) => reasons.length === 0)) {
      return [];
    }

    const deniedReasons = new Set<string>();
    reasonsList.forEach((reasons) => {
      reasons.forEach((reason) => deniedReasons.add(reason));
    });
    return [...deniedReasons];
  }
}
