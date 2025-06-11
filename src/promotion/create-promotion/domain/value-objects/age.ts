import { InvalidAgeError } from '../errors';
import { AgeProps } from '../../../entities/types/promotion.props';

export class Age {
  private readonly gt: number;
  private readonly lt: number;
  private readonly eq: number;
  constructor(ageProps: AgeProps) {
    this.validateProps(ageProps);
    this.eq = ageProps.eq;
    this.lt = ageProps.lt;
    this.gt = ageProps.gt;
  }

  validate(age: number): boolean {
    if (this.eq !== undefined) {
      return age === this.eq;
    }

    const gtCheck = this.gt !== undefined ? age > this.gt : true;
    const ltCheck = this.lt !== undefined ? age < this.lt : true;

    return gtCheck && ltCheck;
  }

  private validateProps({ gt, lt, eq }: AgeProps) {
    const hasRange = gt !== undefined && lt !== undefined;
    const hasLtOrGt = lt !== undefined || gt !== undefined;
    const hasEq = eq !== undefined;

    if (hasEq && hasLtOrGt) {
      throw new InvalidAgeError(
        'Invalid age restriction: cannot combine eq with lt or gt',
      );
    }

    if (hasRange && lt <= gt) {
      throw new InvalidAgeError(
        'Invalid age restriction: gt must be lower than lt',
      );
    }
  }
}
