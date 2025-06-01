import { InvalidRestrictionTypeError } from './errors';
import { PromotionProps, RestrictionNodeProps } from './types/promotion.props';
import { ValidationContextProps } from './types/validation-context.props';
import { Advantage } from './value-objects/advantage';
import { Age } from './value-objects/age';
import { Period } from './value-objects/period';
import { AgeRestriction } from './value-objects/restriction/age-restriction';
import { AndRestriction } from './value-objects/restriction/and-restriction';
import { IRestriction } from './value-objects/restriction/IRestriction';
import { OrRestriction } from './value-objects/restriction/or-restriction';
import { WeatherRestriction } from './value-objects/restriction/weather-restriction';
import { ValidationResult } from './value-objects/validation-result';
import { Weather } from './value-objects/weather';

export class Promotion {
  private readonly name: string;
  private readonly advantage: Advantage;
  private readonly dateRestriction: Period;
  private readonly restrictionTree?: IRestriction;

  constructor(props: PromotionProps) {
    const { name, reductionPercent, period, restrictions } = props;
    this.name = name;
    this.advantage = new Advantage(reductionPercent);
    this.dateRestriction = new Period(period.beginDate, period.endDate);
    if (restrictions) {
      this.restrictionTree = this.parseRestrictions(restrictions);
    }
  }

  getName = (): string => {
    return this.name;
  };

  validate = (context: ValidationContextProps): ValidationResult => {
    const deniedReasons: string[] = [];

    if (!this.dateRestriction.contains(context.date)) {
      deniedReasons.push('DATE_NOT_ELIGIBLE');
    }

    if (this.restrictionTree) {
      deniedReasons.push(...this.restrictionTree.validate(context));
    }

    if (deniedReasons.length > 0) {
      return ValidationResult.denied(this.name, deniedReasons);
    }
    return ValidationResult.accepted(this.name, this.advantage.percent);
  };

  private parseRestrictions(input: RestrictionNodeProps): IRestriction {
    if ('and' in input) {
      return new AndRestriction(
        input.and.map((r) => this.parseRestrictions(r)),
      );
    }
    if ('or' in input) {
      return new OrRestriction(input.or.map((r) => this.parseRestrictions(r)));
    }
    if ('age' in input) {
      return new AgeRestriction(new Age(input.age));
    }
    if ('weather' in input) {
      return new WeatherRestriction(
        new Weather(input.weather.is, input.weather.temp),
      );
    }

    throw new InvalidRestrictionTypeError();
  }
}
