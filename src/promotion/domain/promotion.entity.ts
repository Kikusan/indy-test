import { InvalidRestrictionTypeError } from './errors';
import {
  AgeProps,
  PromotionProps,
  RestrictionNodeProps,
  RestrictionTreeProps,
  WeatherProps,
} from './types/promotion.props';
import { RestrictionNode } from './types/restriction.type';
import { ValidationContextProps } from './types/validation-context.props';
import { Advantage } from './value-objects/advantage';
import { Age } from './value-objects/age';
import { Period } from './value-objects/period';
import { ValidationResult } from './value-objects/validation-result';
import { Weather } from './value-objects/weather';

export class Promotion {
  private readonly name: string;
  private readonly advantage: Advantage;
  private readonly dateRestriction: Period;
  private readonly restrictionTree?: RestrictionNode;

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

  validate = (
    validationContextProps: ValidationContextProps,
  ): ValidationResult => {
    const deniedReasons = [];
    const { date } = validationContextProps;
    if (!this.dateRestriction.contains(date)) {
      deniedReasons.push('DATE_NOT_ELIGIBLE');
    }

    const deniedReasonsFromRestriction = this.validateRestriction(
      this.restrictionTree,
      validationContextProps,
    );
    deniedReasons.push(...deniedReasonsFromRestriction);

    if (deniedReasons.length > 0) {
      return ValidationResult.denied(this.name, deniedReasons);
    }
    return ValidationResult.accepted(this.name, this.advantage.percent);
  };

  private validateRestriction(
    node: RestrictionNode,
    context: ValidationContextProps,
  ): string[] {
    if (!node) return [];

    if ('and' in node) {
      return this.validateAndNode(node.and, context);
    }

    if ('or' in node) {
      return this.validateOrNode(node.or, context);
    }

    return this.validateLeafNode(node, context);
  }

  private validateAndNode(
    nodes: RestrictionNode[],
    context: ValidationContextProps,
  ): string[] {
    const deniedReasons = new Set<string>();

    for (const child of nodes) {
      const childReasons = this.validateRestriction(child, context);
      childReasons.forEach((reason) => deniedReasons.add(reason));
    }

    return [...deniedReasons];
  }

  private validateOrNode(
    nodes: RestrictionNode[],
    context: ValidationContextProps,
  ): string[] {
    const orReasons: string[][] = [];

    for (const child of nodes) {
      const reasons = this.validateRestriction(child, context);
      if (reasons.length === 0) {
        // Au moins un valide, on accepte
        return [];
      }
      orReasons.push(reasons);
    }

    // Aucun valide, on cumule les raisons
    const deniedReasons = new Set<string>();
    orReasons.forEach((reasons) => {
      reasons.forEach((reason) => deniedReasons.add(reason));
    });

    return [...deniedReasons];
  }

  private validateLeafNode(
    node: RestrictionNode,
    context: ValidationContextProps,
  ): string[] {
    const deniedReasons = new Set<string>();

    if ('age' in node && node.age && !node.age.validate(context.age)) {
      deniedReasons.add('AGE_NOT_ELIGIBLE');
    }

    if (
      'weather' in node &&
      node.weather &&
      !node.weather.validate(context.weather)
    ) {
      deniedReasons.add('WEATHER_NOT_ELIGIBLE');
    }

    return [...deniedReasons];
  }

  private parseRestrictions(input: RestrictionNodeProps): RestrictionNode {
    const parsers: Record<
      string,
      (val: RestrictionTreeProps) => RestrictionNode
    > = {
      and: (val: RestrictionNodeProps[]) => ({
        and: val.map((r) => this.parseRestrictions(r)),
      }),
      or: (val: RestrictionNodeProps[]) => ({
        or: val.map((r) => this.parseRestrictions(r)),
      }),
      age: (val: AgeProps) => ({
        age: new Age(val),
      }),
      weather: (val: WeatherProps) => ({
        weather: new Weather(val.is, val.temp),
      }),
    };

    for (const [key, parser] of Object.entries(parsers)) {
      if (key in input) {
        return parser(input[key]);
      }
    }

    throw new InvalidRestrictionTypeError();
  }
}
