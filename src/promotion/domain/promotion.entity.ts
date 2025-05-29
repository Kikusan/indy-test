import { PromotionProps } from './promotion.props';
import { Restriction } from './restriction.type';
import { Advantage } from './value-objects/advantage';
import { Period } from './value-objects/period';

export class Promotion {
  private readonly name: string;
  private readonly advantage: Advantage;
  private readonly restrictions: Restriction[] = [];

  constructor(props: PromotionProps) {
    const { name, reductionPercent, period } = props;
    this.name = name;
    this.advantage = new Advantage(reductionPercent);
    const dateRestriction: Restriction = {
      date: new Period(period.beginDate, period.endDate),
    };
    this.restrictions.push(dateRestriction);
  }
}
