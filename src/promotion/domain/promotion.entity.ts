import {
  AgeProps,
  PromotionProps,
  RestrictionNodeProps,
  RestrictionTreeProps,
  WeatherProps,
} from './promotion.props';
import { RestrictionNode } from './restriction.type';
import { Advantage } from './value-objects/advantage';
import { Age } from './value-objects/age';
import { Period } from './value-objects/period';
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

    throw new Error('Unknown restriction type');
  }
}
