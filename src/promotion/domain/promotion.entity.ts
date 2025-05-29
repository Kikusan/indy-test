import { PromotionProps } from './promotion.props';
import { Restriction } from './restriction.type';
import { Advantage } from './value-objects/advantage';

export class Promotion {
  private readonly name: string;
  private readonly advantage: Advantage;
  private readonly restrictions: Restriction[] = [];

  constructor(props: PromotionProps) {
    const { name, reductionPercent, period } = props;
    this.name = name;
    this.advantage = new Advantage(reductionPercent);
    const dateRestriction: Restriction = {
      date: {
        after: period.beginDate,
        before: period.endDate,
      },
    };
    this.restrictions.push(dateRestriction);
  }
}
