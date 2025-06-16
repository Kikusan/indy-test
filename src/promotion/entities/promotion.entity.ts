import { InvalidRestrictionTypeError } from './errors';
import { PromotionProps } from './types/promotion.props';
import { ValidationContextProps } from './types/validation-context.props';
import { Advantage } from './value-objects/advantage';
import { Age } from './value-objects/age';
import { Period } from './value-objects/period';
import { AgeRestriction } from './value-objects/restriction/age-restriction';
import { AndRestriction } from './value-objects/restriction/and-restriction';
import { IRestriction } from './value-objects/restriction/IRestriction';
import { OrRestriction } from './value-objects/restriction/or-restriction';
import { WeatherRestriction } from './value-objects/restriction/weather-restriction';
import { ValidationResult } from '../validate-promotion/dto/validation-result';
import { Weather } from './value-objects/weather';

type CreatorFn = (input: any) => IRestriction;
export class Promotion {
  private readonly name: string;
  private readonly advantage: Advantage;
  private readonly dateRestriction: Period;
  private readonly restrictionTree?: IRestriction;

  private readonly creators: Record<string, CreatorFn> = {
    and: (input) =>
      new AndRestriction(input.map((r) => this.parseRestrictions(r))),
    or: (input) =>
      new OrRestriction(input.map((r) => this.parseRestrictions(r))),
    age: (input) => new AgeRestriction(new Age(input)),
    weather: (input) =>
      new WeatherRestriction(new Weather(input.is, input.temp)),
  };

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

  parseRestrictions = (input) => {
    const key = Object.keys(input)[0];
    const creator = this.creators[key];
    if (!creator) throw new InvalidRestrictionTypeError();
    return creator(input[key]);
  };
}
